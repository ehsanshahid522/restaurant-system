package com.pizzashop.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Order implements Serializable {
    private static final long serialVersionUID = 1L;

    private String orderId;
    private String date;
    private String time;
    private long timestamp;
    private String customerName;
    private String customerPhone;
    private String customerAddress;
    private String tableNumber;
    private String orderType;
    private String paymentMethod;
    private List<CartItem> items;
    private double subtotal;
    private double discountAmount;
    private double taxAmount;
    private double grandTotal;
    private double cashTendered;
    private double changeAmount;
    private String status;

    public Order() {
        this.items = new ArrayList<>();
        this.status = "Completed";
    }

    public Order(String orderId, String date, String time, long timestamp,
                 String customerName, String customerPhone, String customerAddress,
                 String tableNumber, String orderType, String paymentMethod,
                 List<CartItem> items, double subtotal, double discountAmount,
                 double taxAmount, double grandTotal, double cashTendered, double changeAmount) {
        this.orderId = orderId;
        this.date = date;
        this.time = time;
        this.timestamp = timestamp;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.customerAddress = customerAddress;
        this.tableNumber = tableNumber;
        this.orderType = orderType;
        this.paymentMethod = paymentMethod;
        this.items = items != null ? items : new ArrayList<CartItem>();
        this.subtotal = subtotal;
        this.discountAmount = discountAmount;
        this.taxAmount = taxAmount;
        this.grandTotal = grandTotal;
        this.cashTendered = cashTendered;
        this.changeAmount = changeAmount;
        this.status = "Completed";
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getCustomerAddress() { return customerAddress; }
    public void setCustomerAddress(String customerAddress) { this.customerAddress = customerAddress; }

    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }

    public String getOrderType() { return orderType; }
    public void setOrderType(String orderType) { this.orderType = orderType; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public List<CartItem> getItems() { return items; }
    public void setItems(List<CartItem> items) { this.items = items; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }

    public double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(double discountAmount) { this.discountAmount = discountAmount; }

    public double getTaxAmount() { return taxAmount; }
    public void setTaxAmount(double taxAmount) { this.taxAmount = taxAmount; }

    public double getGrandTotal() { return grandTotal; }
    public void setGrandTotal(double grandTotal) { this.grandTotal = grandTotal; }

    public double getCashTendered() { return cashTendered; }
    public void setCashTendered(double cashTendered) { this.cashTendered = cashTendered; }

    public double getChangeAmount() { return changeAmount; }
    public void setChangeAmount(double changeAmount) { this.changeAmount = changeAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getTotalItemQuantity() {
        int count = 0;
        if (items != null) {
            for (CartItem it : items) {
                count += it.getQuantity();
            }
        }
        return count;
    }

    public String getItemsSummary() {
        if (items == null || items.isEmpty()) return "-";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < items.size(); i++) {
            CartItem it = items.get(i);
            sb.append(it.getQuantity()).append("x ").append(it.getName());
            if (it.getSize() != null && !it.getSize().equals("-")) {
                sb.append("(").append(it.getSize()).append(")");
            }
            if (i < items.size() - 1) {
                sb.append(", ");
            }
        }
        return sb.toString();
    }
}
