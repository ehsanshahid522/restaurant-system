package com.pizzashop.model;

import java.io.Serializable;

public class CartItem implements Serializable {
    private static final long serialVersionUID = 1L;

    private String menuItemId;
    private String name;
    private String size;
    private String crust;
    private double crustPrice;
    private double unitPrice;
    private int quantity;

    public CartItem(String menuItemId, String name, String size, String crust, double crustPrice, double unitPrice, int quantity) {
        this.menuItemId = menuItemId;
        this.name = name;
        this.size = size;
        this.crust = crust;
        this.crustPrice = crustPrice;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
    }

    public String getMenuItemId() { return menuItemId; }
    public String getName() { return name; }
    public String getSize() { return size; }
    public String getCrust() { return crust; }
    public double getCrustPrice() { return crustPrice; }
    public double getUnitPrice() { return unitPrice; }
    public int getQuantity() { return quantity; }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getEffectiveUnitPrice() {
        return unitPrice + crustPrice;
    }

    public double getTotalPrice() {
        return getEffectiveUnitPrice() * quantity;
    }

    public String getDisplayName() {
        StringBuilder sb = new StringBuilder(name);
        if (size != null && !size.isEmpty() && !size.equals("-")) {
            sb.append(" [").append(size).append("]");
        }
        if (crust != null && !crust.isEmpty() && !crust.equals("-") && !crust.equals("Regular Pan")) {
            sb.append(" (").append(crust).append(")");
        }
        return sb.toString();
    }
}
