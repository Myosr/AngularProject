export interface Order {
    orderID?: number;
    customerID?: number;
    customerName?: string;
    orderDate?: string;
    expectedDeliveryDate?: string;
    customerPurchaseOrderNumber?: string;
    contactPersonName?: string;
    salespersonName?: string;
    status?: string;
    totalAmount?: number;
    comments?: string;
    deliveryInstructions?: string;
    orderLines?: OrderLine[];
}

export interface OrderLine {
    orderLineID?: number;
    orderID?: number;
    stockItemID?: number;
    stockItemName?: string;
    description?: string;
    quantity?: number;
    unitPrice?: number;
    taxRate?: number;
    pickedQuantity?: number;
    lineTotal?: number;
}
