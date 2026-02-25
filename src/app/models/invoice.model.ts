export interface UserInvoice {
    invoiceID?: number;
    customerID?: number;
    customerName?: string;
    billToCustomerName?: string;
    orderID?: number;
    invoiceDate?: string;
    customerPurchaseOrderNumber?: string;
    isCreditNote?: boolean;
    totalAmount?: number;
    totalTax?: number;
    totalWithTax?: number;
    paymentStatus?: string;
    outstandingBalance?: number;
    paymentDays?: number;
}
