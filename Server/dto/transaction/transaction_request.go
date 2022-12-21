package transactiondto

type TransactionRequest struct {
	UserID     int            `json:"-" gorm:"type: int"`
	TotalPrice int            `json:"totalprice" form:"totalprice"`
	Order      []OrderRequest `json:"order" form:"order"`
}

type TransactionUpdate struct {
	Status string `json:"status"  gorm:"type:varchar(255)"`
}
