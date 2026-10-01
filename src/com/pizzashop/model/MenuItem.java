package com.pizzashop.model;

import java.io.Serializable;

public class MenuItem implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String name;
    private String category;
    private String description;
    private boolean isPizza;
    private double priceSmall;
    private double priceMedium;
    private double priceLarge;
    private double priceFamily;
    private double singlePrice;

    public MenuItem(String id, String name, String category, String description,
                    double priceSmall, double priceMedium, double priceLarge, double priceFamily) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.isPizza = true;
        this.priceSmall = priceSmall;
        this.priceMedium = priceMedium;
        this.priceLarge = priceLarge;
        this.priceFamily = priceFamily;
        this.singlePrice = priceMedium;
    }

    public MenuItem(String id, String name, String category, String description, double singlePrice) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.isPizza = false;
        this.priceSmall = 0;
        this.priceMedium = 0;
        this.priceLarge = 0;
        this.priceFamily = 0;
        this.singlePrice = singlePrice;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getCategory() { return category; }
    public String getDescription() { return description; }
    public boolean isPizza() { return isPizza; }
    public double getPriceSmall() { return priceSmall; }
    public double getPriceMedium() { return priceMedium; }
    public double getPriceLarge() { return priceLarge; }
    public double getPriceFamily() { return priceFamily; }
    public double getSinglePrice() { return singlePrice; }

    public double getPriceForSize(String size) {
        if (!isPizza) return singlePrice;
        if ("Small".equalsIgnoreCase(size)) return priceSmall;
        if ("Medium".equalsIgnoreCase(size)) return priceMedium;
        if ("Large".equalsIgnoreCase(size)) return priceLarge;
        if ("Family".equalsIgnoreCase(size)) return priceFamily;
        return priceMedium;
    }

    @Override
    public String toString() {
        return name + " (" + category + ")";
    }
}
