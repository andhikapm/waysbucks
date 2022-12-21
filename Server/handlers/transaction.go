package handlers

import (
	dto "Stage2Backend/dto/result"
	transactiondto "Stage2Backend/dto/transaction"
	"Stage2Backend/models"
	"Stage2Backend/repositories"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"strconv"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"

	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/coreapi"
	"github.com/midtrans/midtrans-go/snap"
)

var c = coreapi.Client{
	ServerKey: os.Getenv("SERVER_KEY"),
	ClientKey: os.Getenv("CLIENT_KEY"),
}

type Data struct {
	TransID int
	OrderID []int
}

type handlerTransaction struct {
	TransactionRepository repositories.TransactionRepository
}

func HandlerTransaction(TransactionRepository repositories.TransactionRepository) *handlerTransaction {
	return &handlerTransaction{TransactionRepository}
}

func (h *handlerTransaction) FindTransactions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	transaction, err := h.TransactionRepository.FindTransactions()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	var data []models.Transaction
	for _, sT := range transaction {

		var orderData []models.OrderResponse

		for _, s := range sT.Order {

			orderLoop, _ := h.TransactionRepository.FindTransOrders(s.ID)

			orderRes := models.OrderResponse{
				ID:             orderLoop.ID,
				Transaction_ID: sT.ID,
				ProductID:      orderLoop.ID,
				Product:        orderLoop.Product,
				OrderPrice:     orderLoop.OrderPrice,
				Topping:        orderLoop.Topping,
			}
			orderData = append(orderData, orderRes)
		}

		dataGet := models.Transaction{
			ID:         sT.ID,
			UserID:     sT.UserID,
			User:       sT.User,
			Status:     sT.Status,
			TotalPrice: sT.TotalPrice,
			Payment:    sT.Payment,
			Order:      orderData,
		}
		data = append(data, dataGet)
	}

	//fmt.Println(data)
	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Status: "success", Data: data}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerTransaction) GetTransaction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	var transaction models.Transaction
	transaction, err := h.TransactionRepository.GetTransaction(id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	//fmt.Println(transaction)

	var orderData []models.OrderResponse

	for _, s := range transaction.Order {

		orderLoop, _ := h.TransactionRepository.FindTransOrders(s.ID)

		orderRes := models.OrderResponse{
			ID:             orderLoop.ID,
			Transaction_ID: s.ID,
			ProductID:      orderLoop.ID,
			Product:        orderLoop.Product,
			OrderPrice:     orderLoop.OrderPrice,
			Topping:        orderLoop.Topping,
		}
		orderData = append(orderData, orderRes)
	}

	data := models.Transaction{
		ID:         transaction.ID,
		UserID:     transaction.UserID,
		User:       transaction.User,
		Status:     transaction.Status,
		TotalPrice: transaction.TotalPrice,
		Payment:    transaction.Payment,
		Order:      orderData,
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Status: "success", Data: data}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerTransaction) CreateTransaction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	user_ID := int(userInfo["id"].(float64))
	userName := userInfo["name"]
	userEmail := userInfo["email"]

	strName := fmt.Sprintf("%v", userName)
	strEmail := fmt.Sprintf("%v", userEmail)

	request := new(transactiondto.TransactionRequest)
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Status: "failed1", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	var TransIdIsMatch = false
	var TransactionId int
	for !TransIdIsMatch {
		TransactionId = user_ID + rand.Intn(100000) - rand.Intn(100)
		transactionData, _ := h.TransactionRepository.GetTransaction(TransactionId)
		if transactionData.ID == 0 {
			TransIdIsMatch = true
		}
	}

	transaction := models.Transaction{
		ID:         TransactionId,
		UserID:     user_ID,
		Status:     "On Progress",
		TotalPrice: request.TotalPrice,
	}

	transaction, err = h.TransactionRepository.CreateTransaction(transaction)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Status: "failed2", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	transaction, _ = h.TransactionRepository.GetTransaction(transaction.ID)

	var TransOrder []models.Order
	for _, s := range request.Order {

		topping, _ := h.TransactionRepository.FindTransToppingId(s.ToppingID)

		order := models.Order{
			Transaction_ID: transaction.ID,
			ProductID:      s.ProductID,
			OrderPrice:     s.OrderPrice,
			Topping:        topping,
		}

		TransOrder = append(TransOrder, order)

	}

	Ordering, err := h.TransactionRepository.CreateTransOrder(TransOrder)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Status: "failed3", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	var orderData []models.OrderResponse

	for _, s := range Ordering {

		orderLoop, _ := h.TransactionRepository.FindTransOrders(s.ID)

		orderRes := models.OrderResponse{
			ID:             orderLoop.ID,
			Transaction_ID: transaction.ID,
			ProductID:      orderLoop.ProductID,
			Product:        orderLoop.Product,
			OrderPrice:     orderLoop.OrderPrice,
			Topping:        orderLoop.Topping,
		}
		orderData = append(orderData, orderRes)
	}

	data := models.Transaction{
		ID:         transaction.ID,
		UserID:     transaction.UserID,
		User:       transaction.User,
		Status:     transaction.Status,
		TotalPrice: transaction.TotalPrice,
		Order:      orderData,
	}

	var s = snap.Client{}
	s.New(os.Getenv("SERVER_KEY"), midtrans.Sandbox)
	//fmt.Println(os.Getenv("SERVER_KEY"))
	//fmt.Println(os.Getenv("CLIENT_KEY"))
	// Use to midtrans.Production if you want Production Environment (accept real transaction).

	// 2. Initiate Snap request param
	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  strconv.Itoa(data.ID),
			GrossAmt: int64(data.TotalPrice),
		},
		CreditCard: &snap.CreditCardDetails{
			Secure: true,
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: strName,
			Email: strEmail,
		},
	}

	// 3. Execute request create Snap transaction to Midtrans Snap API
	snapResp, _ := s.CreateTransaction(req)
	//fmt.Println(snapResp)

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Status: "otw", Data: snapResp}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerTransaction) UpdateTransaction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	//userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	//userRole := userInfo["role"]
	//userID := int(userInfo["id"].(float64))

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	request := new(transactiondto.TransactionUpdate)
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Status: "failed1", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	transaction, err := h.TransactionRepository.GetTransaction(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	if request.Status != "" {
		transaction.Status = request.Status
	}

	transaction, err = h.TransactionRepository.UpdateTransaction(transaction)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	var orderData []models.OrderResponse

	for _, s := range transaction.Order {

		orderLoop, _ := h.TransactionRepository.FindTransOrders(s.ID)

		orderRes := models.OrderResponse{
			ID:             orderLoop.ID,
			Transaction_ID: transaction.ID,
			ProductID:      orderLoop.ID,
			Product:        orderLoop.Product,
			OrderPrice:     orderLoop.OrderPrice,
			Topping:        orderLoop.Topping,
		}
		orderData = append(orderData, orderRes)
	}

	data := models.Transaction{
		ID:         transaction.ID,
		UserID:     transaction.UserID,
		User:       transaction.User,
		Status:     transaction.Status,
		TotalPrice: transaction.TotalPrice,
		Order:      orderData,
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Status: "success", Data: data}
	json.NewEncoder(w).Encode(response)

}

func (h *handlerTransaction) DeleteTransaction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	//userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	//userRole := userInfo["role"]
	//userID := int(userInfo["id"].(float64))

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	transaction, err := h.TransactionRepository.GetTransaction(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	order, err := h.TransactionRepository.WhereTransOrder(transaction.ID)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	order, err = h.TransactionRepository.DeleteTransOrder(order)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	var getID []int

	for _, s := range order {
		getID = append(getID, s.ID)
	}

	transaction, err = h.TransactionRepository.DeleteTransaction(transaction)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	data := Data{
		TransID: transaction.ID,
		OrderID: getID,
	}
	//h.TransactionRepository.DeleteTransOrder(transaction.Order)

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Status: "success", Data: data}
	json.NewEncoder(w).Encode(response)

}

func (h *handlerTransaction) GetMyTrans(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userID := int(userInfo["id"].(float64))

	//fmt.Println(userID)
	transaction, err := h.TransactionRepository.GetMyTransaction(userID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	var data []models.Transaction
	for _, sT := range transaction {

		var orderData []models.OrderResponse

		for _, s := range sT.Order {

			orderLoop, _ := h.TransactionRepository.FindTransOrders(s.ID)

			orderRes := models.OrderResponse{
				ID:             orderLoop.ID,
				Transaction_ID: sT.ID,
				ProductID:      orderLoop.ID,
				Product:        orderLoop.Product,
				OrderPrice:     orderLoop.OrderPrice,
				Topping:        orderLoop.Topping,
			}
			orderData = append(orderData, orderRes)
		}

		dataGet := models.Transaction{
			ID:         sT.ID,
			UserID:     sT.UserID,
			User:       sT.User,
			Status:     sT.Status,
			TotalPrice: sT.TotalPrice,
			Order:      orderData,
		}
		data = append(data, dataGet)
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Status: "success", Data: data}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerTransaction) Notification(w http.ResponseWriter, r *http.Request) {
	var notificationPayload map[string]interface{}

	err := json.NewDecoder(r.Body).Decode(&notificationPayload)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	transactionStatus := notificationPayload["transaction_status"].(string)
	fraudStatus := notificationPayload["fraud_status"].(string)
	orderId := notificationPayload["order_id"].(string)

	if transactionStatus == "capture" {
		if fraudStatus == "challenge" {
			// TODO set transaction status on your database to 'challenge'
			// e.g: 'Payment status challenged. Please take action on your Merchant Administration Portal
			h.TransactionRepository.UpdatePayment("pending", orderId)
		} else if fraudStatus == "accept" {
			// TODO set transaction status on your database to 'success'
			h.TransactionRepository.UpdatePayment("success", orderId)
		}
	} else if transactionStatus == "settlement" {
		// TODO set transaction status on your databaase to 'success'
		h.TransactionRepository.UpdatePayment("success", orderId)
	} else if transactionStatus == "deny" {
		// TODO you can ignore 'deny', because most of the time it allows payment retries
		// and later can become success
		h.TransactionRepository.UpdatePayment("failed", orderId)
	} else if transactionStatus == "cancel" || transactionStatus == "expire" {
		// TODO set transaction status on your databaase to 'failure'
		h.TransactionRepository.UpdatePayment("failed", orderId)
	} else if transactionStatus == "pending" {
		// TODO set transaction status on your databaase to 'pending' / waiting payment
		h.TransactionRepository.UpdatePayment("pending", orderId)
	}

	w.WriteHeader(http.StatusOK)
}
