package transactiondto

type OrderRequest struct {
	ProductID  int   `json:"product" form:"product" gorm:"type: int"`
	OrderPrice int   `json:"price" form:"price"`
	ToppingID  []int `json:"toppings" form:"toppings" gorm:"type:int[]"`
}
