package com.pizzashop.data;

import com.pizzashop.model.CartItem;
import com.pizzashop.model.MenuItem;
import com.pizzashop.model.Order;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;

public class DataManager {
    private static DataManager instance;

    private List<MenuItem> menuItems;
    private List<Order> orders;

    private final File dataDir;
    private final File menuFile;
    private final File ordersFile;

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    private final SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");

    private DataManager() {
        dataDir = new File("data");
        if (!dataDir.exists()) {
            dataDir.mkdirs();
        }
        menuFile = new File(dataDir, "menu.txt");
        ordersFile = new File(dataDir, "orders.txt");

        menuItems = new ArrayList<MenuItem>();
        orders = new ArrayList<Order>();

        loadMenu();
        loadOrders();
    }

    public static synchronized DataManager getInstance() {
        if (instance == null) {
            instance = new DataManager();
        }
        return instance;
    }

    // ================= MENU MANAGEMENT =================
    private void loadMenu() {
        menuItems.clear();
        if (menuFile.exists()) {
            BufferedReader reader = null;
            try {
                reader = new BufferedReader(new InputStreamReader(new FileInputStream(menuFile), "UTF-8"));
                String line;
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) continue;
                    String[] parts = line.split("\\|", -1);
                    if (parts.length >= 8) {
                        String id = parts[0];
                        String name = parts[1];
                        String category = parts[2];
                        String description = parts[3];
                        boolean isPizza = Boolean.parseBoolean(parts[4]);
                        if (isPizza) {
                            double s = Double.parseDouble(parts[5]);
                            double m = Double.parseDouble(parts[6]);
                            double l = Double.parseDouble(parts[7]);
                            double f = parts.length > 8 ? Double.parseDouble(parts[8]) : l * 1.3;
                            menuItems.add(new MenuItem(id, name, category, description, s, m, l, f));
                        } else {
                            double price = Double.parseDouble(parts[5]);
                            menuItems.add(new MenuItem(id, name, category, description, price));
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Error loading menu: " + e.getMessage());
            } finally {
                if (reader != null) {
                    try { reader.close(); } catch (IOException ignored) {}
                }
            }
        }

        if (menuItems.isEmpty()) {
            initDefaultMenu();
            saveMenu();
        }
    }

    private void initDefaultMenu() {
        // Pizzas
        menuItems.add(new MenuItem("P1", "Chicken Tikka Pizza", "Pizza", "Traditional chicken tikka chunks, onion, mozzarella cheese & herbs", 550, 1150, 1650, 2150));
        menuItems.add(new MenuItem("P2", "Chicken Fajita Pizza", "Pizza", "Fajita chicken, onions, bell peppers, mozzarella & special sauce", 550, 1150, 1650, 2150));
        menuItems.add(new MenuItem("P3", "Pepperoni Feast", "Pizza", "Loaded pepperoni, double mozzarella cheese & oregano herbs", 600, 1250, 1750, 2250));
        menuItems.add(new MenuItem("P4", "BBQ Buzz Special", "Pizza", "Smoky BBQ chicken, smoked onions, jalapenos & BBQ sauce drizzle", 600, 1250, 1750, 2250));
        menuItems.add(new MenuItem("P5", "Cheese Lover / Margherita", "Pizza", "Rich tomato basil sauce layered with pure mozzarella & cheddar", 480, 990, 1450, 1890));
        menuItems.add(new MenuItem("P6", "Veggie Delight", "Pizza", "Olives, mushrooms, bell peppers, sweet corn, onions & cheese", 480, 990, 1450, 1890));
        menuItems.add(new MenuItem("P7", "Malai Boti Crown Crust", "Pizza", "Creamy chicken chunks, mild spices, cream sauce & garlic mayo", 650, 1350, 1850, 2390));

        // Sides
        menuItems.add(new MenuItem("S1", "Garlic Bread (4 Pcs)", "Sides", "Toasted herb garlic bread with garlic butter glaze", 280));
        menuItems.add(new MenuItem("S2", "Cheesy Garlic Bread", "Sides", "Crispy French loaf topped with melted mozzarella cheese", 380));
        menuItems.add(new MenuItem("S3", "Chicken Hot Wings (6 Pcs)", "Sides", "Spicy roasted chicken wings with dip sauce", 450));
        menuItems.add(new MenuItem("S4", "Crispy French Fries", "Sides", "Golden crispy salted potato fries", 220));
        menuItems.add(new MenuItem("S5", "Extra Dip Sauce", "Sides", "Garlic mayo or hot chili peri sauce", 70));

        // Beverages
        menuItems.add(new MenuItem("B1", "Soft Drink (Can 345ml)", "Beverages", "Pepsi / 7Up / Mirinda / Coke / Sprite", 120));
        menuItems.add(new MenuItem("B2", "Soft Drink (1.5 Litre)", "Beverages", "Chilled family bottle", 240));
        menuItems.add(new MenuItem("B3", "Mineral Water (500ml)", "Beverages", "Chilled pure mineral water", 70));
    }

    public synchronized void saveMenu() {
        PrintWriter writer = null;
        try {
            writer = new PrintWriter(new OutputStreamWriter(new FileOutputStream(menuFile), "UTF-8"));
            writer.println("# ID|Name|Category|Description|isPizza|PriceSmall/Single|PriceMed|PriceLarge|PriceFamily");
            for (MenuItem item : menuItems) {
                if (item.isPizza()) {
                    writer.println(item.getId() + "|" + item.getName() + "|" + item.getCategory() + "|" +
                            item.getDescription() + "|true|" + item.getPriceSmall() + "|" +
                            item.getPriceMedium() + "|" + item.getPriceLarge() + "|" + item.getPriceFamily());
                } else {
                    writer.println(item.getId() + "|" + item.getName() + "|" + item.getCategory() + "|" +
                            item.getDescription() + "|false|" + item.getSinglePrice() + "|0|0|0");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (writer != null) writer.close();
        }
    }

    public List<MenuItem> getMenuItems() {
        return new ArrayList<MenuItem>(menuItems);
    }

    public synchronized void addMenuItem(MenuItem item) {
        menuItems.add(item);
        saveMenu();
    }

    public synchronized void removeMenuItem(String id) {
        Iterator<MenuItem> it = menuItems.iterator();
        while (it.hasNext()) {
            if (it.next().getId().equals(id)) {
                it.remove();
                break;
            }
        }
        saveMenu();
    }

    // ================= ORDERS MANAGEMENT =================
    private void loadOrders() {
        orders.clear();
        if (ordersFile.exists()) {
            BufferedReader reader = null;
            try {
                reader = new BufferedReader(new InputStreamReader(new FileInputStream(ordersFile), "UTF-8"));
                String line;
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) continue;
                    String[] parts = line.split("\\|", -1);
                    if (parts.length >= 17) {
                        String orderId = parts[0];
                        String date = parts[1];
                        String time = parts[2];
                        long timestamp = Long.parseLong(parts[3]);
                        String custName = parts[4];
                        String custPhone = parts[5];
                        String custAddr = parts[6];
                        String tableNum = parts[7];
                        String orderType = parts[8];
                        String payMethod = parts[9];
                        double subtotal = Double.parseDouble(parts[10]);
                        double discount = Double.parseDouble(parts[11]);
                        double tax = Double.parseDouble(parts[12]);
                        double grandTotal = Double.parseDouble(parts[13]);
                        double cashTendered = Double.parseDouble(parts[14]);
                        double change = Double.parseDouble(parts[15]);
                        String itemsRaw = parts[16];

                        List<CartItem> items = new ArrayList<CartItem>();
                        if (!itemsRaw.isEmpty()) {
                            String[] rawList = itemsRaw.split(";;");
                            for (String itStr : rawList) {
                                String[] f = itStr.split("~", -1);
                                if (f.length >= 7) {
                                    String mId = f[0];
                                    String name = f[1];
                                    String size = f[2];
                                    String crust = f[3];
                                    double crustPrice = Double.parseDouble(f[4]);
                                    double unitPrice = Double.parseDouble(f[5]);
                                    int qty = Integer.parseInt(f[6]);
                                    items.add(new CartItem(mId, name, size, crust, crustPrice, unitPrice, qty));
                                }
                            }
                        }

                        Order o = new Order(orderId, date, time, timestamp, custName, custPhone, custAddr,
                                tableNum, orderType, payMethod, items, subtotal, discount, tax, grandTotal,
                                cashTendered, change);
                        orders.add(o);
                    }
                }
            } catch (Exception e) {
                System.err.println("Error reading orders: " + e.getMessage());
            } finally {
                if (reader != null) {
                    try { reader.close(); } catch (IOException ignored) {}
                }
            }
        }

        // If no orders yet, add one sample order for demo
        if (orders.isEmpty()) {
            Date now = new Date();
            String d = dateFormat.format(now);
            String t = timeFormat.format(now);
            List<CartItem> demoItems = new ArrayList<CartItem>();
            demoItems.add(new CartItem("P1", "Chicken Tikka Pizza", "Medium", "Regular Pan", 0, 1150, 1));
            demoItems.add(new CartItem("B1", "Soft Drink (Can 345ml)", "-", "-", 0, 120, 2));

            Order demo = new Order("ORD-1001", d, t, now.getTime(), "Walk-in Guest", "0300-1234567",
                    "-", "Table 2", "Dine-in", "Cash", demoItems, 1390, 0, 0, 1390, 1500, 110);
            orders.add(demo);
            saveOrders();
        }
    }

    public synchronized void saveOrders() {
        PrintWriter writer = null;
        try {
            writer = new PrintWriter(new OutputStreamWriter(new FileOutputStream(ordersFile), "UTF-8"));
            writer.println("# OrderID|Date|Time|Timestamp|CustomerName|Phone|Address|Table|OrderType|PaymentMethod|Subtotal|Discount|Tax|GrandTotal|CashTendered|Change|ItemsRaw");
            for (Order o : orders) {
                StringBuilder itemsSb = new StringBuilder();
                if (o.getItems() != null) {
                    for (int i = 0; i < o.getItems().size(); i++) {
                        CartItem ci = o.getItems().get(i);
                        itemsSb.append(ci.getMenuItemId()).append("~")
                               .append(ci.getName().replace("~", "-")).append("~")
                               .append(ci.getSize()).append("~")
                               .append(ci.getCrust()).append("~")
                               .append(ci.getCrustPrice()).append("~")
                               .append(ci.getUnitPrice()).append("~")
                               .append(ci.getQuantity());
                        if (i < o.getItems().size() - 1) {
                            itemsSb.append(";;");
                        }
                    }
                }

                writer.println(
                        o.getOrderId() + "|" +
                        o.getDate() + "|" +
                        o.getTime() + "|" +
                        o.getTimestamp() + "|" +
                        (o.getCustomerName() != null ? o.getCustomerName().replace("|", " ") : "") + "|" +
                        (o.getCustomerPhone() != null ? o.getCustomerPhone().replace("|", " ") : "") + "|" +
                        (o.getCustomerAddress() != null ? o.getCustomerAddress().replace("|", " ") : "") + "|" +
                        (o.getTableNumber() != null ? o.getTableNumber().replace("|", " ") : "") + "|" +
                        o.getOrderType() + "|" +
                        o.getPaymentMethod() + "|" +
                        o.getSubtotal() + "|" +
                        o.getDiscountAmount() + "|" +
                        o.getTaxAmount() + "|" +
                        o.getGrandTotal() + "|" +
                        o.getCashTendered() + "|" +
                        o.getChangeAmount() + "|" +
                        itemsSb.toString()
                );
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (writer != null) writer.close();
        }
    }

    public synchronized void addOrder(Order order) {
        orders.add(0, order); // Most recent first
        saveOrders();
    }

    public String generateNextOrderId() {
        int maxId = 1000;
        for (Order o : orders) {
            try {
                if (o.getOrderId() != null && o.getOrderId().startsWith("ORD-")) {
                    int val = Integer.parseInt(o.getOrderId().substring(4));
                    if (val > maxId) maxId = val;
                }
            } catch (Exception ignored) {}
        }
        return "ORD-" + (maxId + 1);
    }

    public List<Order> getAllOrders() {
        return new ArrayList<Order>(orders);
    }

    public List<Order> getOrdersByDate(String date) {
        List<Order> list = new ArrayList<Order>();
        for (Order o : orders) {
            if (date.equals(o.getDate())) {
                list.add(o);
            }
        }
        return list;
    }

    public double getTotalSales() {
        double total = 0;
        for (Order o : orders) {
            total += o.getGrandTotal();
        }
        return total;
    }

    public double getTodaySales() {
        String today = dateFormat.format(new Date());
        double total = 0;
        for (Order o : orders) {
            if (today.equals(o.getDate())) {
                total += o.getGrandTotal();
            }
        }
        return total;
    }

    public int getTotalOrdersCount() {
        return orders.size();
    }

    public int getTodayOrdersCount() {
        String today = dateFormat.format(new Date());
        int count = 0;
        for (Order o : orders) {
            if (today.equals(o.getDate())) {
                count++;
            }
        }
        return count;
    }

    public double getAverageOrderValue() {
        if (orders.isEmpty()) return 0;
        return getTotalSales() / orders.size();
    }

    public boolean exportSalesToCSV(File targetFile) {
        PrintWriter pw = null;
        try {
            pw = new PrintWriter(new OutputStreamWriter(new FileOutputStream(targetFile), "UTF-8"));
            pw.println("Order ID,Date,Time,Customer Name,Phone,Order Type,Table/Address,Items,Subtotal,Discount,Tax,Grand Total,Payment Method");
            for (Order o : orders) {
                String itemsSummary = o.getItemsSummary().replace("\"", "\"\"");
                String tableOrAddress = (o.getTableNumber() != null && !o.getTableNumber().isEmpty()) 
                        ? o.getTableNumber() 
                        : (o.getCustomerAddress() != null ? o.getCustomerAddress() : "-");

                pw.println(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.2f,%.2f,%.2f,%.2f,\"%s\"",
                        o.getOrderId(),
                        o.getDate(),
                        o.getTime(),
                        o.getCustomerName() != null ? o.getCustomerName() : "",
                        o.getCustomerPhone() != null ? o.getCustomerPhone() : "",
                        o.getOrderType(),
                        tableOrAddress.replace("\"", "\"\""),
                        itemsSummary,
                        o.getSubtotal(),
                        o.getDiscountAmount(),
                        o.getTaxAmount(),
                        o.getGrandTotal(),
                        o.getPaymentMethod()));
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        } finally {
            if (pw != null) pw.close();
        }
    }
}
