package com.pizzashop.ui;

import com.pizzashop.data.DataManager;
import com.pizzashop.model.CartItem;
import com.pizzashop.model.MenuItem;
import com.pizzashop.model.Order;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.*;
import java.io.File;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class MainFrame extends JFrame {
    private final DataManager dataManager;
    private final DecimalFormat currencyFmt = new DecimalFormat("#,##0.00");
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    private final SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss");

    // UI Panels
    private CardLayout cardLayout;
    private JPanel mainContainer;
    private JLabel lblClock;
    private JLabel lblTodaySalesHeader;
    private JLabel lblTodayOrdersHeader;

    // POS Tab Components
    private JPanel menuItemsPanel;
    private String selectedCategory = "All";
    private final List<CartItem> cartItems = new ArrayList<CartItem>();
    private DefaultTableModel cartTableModel;
    private JTable cartTable;

    private JComboBox<String> cbOrderType;
    private JTextField txtCustomerName;
    private JTextField txtCustomerPhone;
    private JTextField txtTableOrAddress;
    private JLabel lblTableOrAddress;

    private JLabel lblSubtotal;
    private JTextField txtDiscount;
    private JLabel lblTax;
    private JLabel lblGrandTotal;
    private JComboBox<String> cbPaymentMethod;
    private JTextField txtCashPaid;
    private JLabel lblChangeReturn;

    // Sales Tab Components
    private JLabel lblKpiTotalSales;
    private JLabel lblKpiTodaySales;
    private JLabel lblKpiTotalOrders;
    private JLabel lblKpiTodayOrders;
    private JLabel lblKpiAvgOrder;
    private DefaultTableModel salesTableModel;
    private JTable salesTable;
    private JComboBox<String> cbSalesFilter;
    private JTextField txtSalesSearch;

    // Menu Management Tab Components
    private DefaultTableModel menuTableModel;
    private JTable menuTable;

    public MainFrame() {
        super("Pizza Shop POS & Sales Management System (Offline)");
        this.dataManager = DataManager.getInstance();

        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1280, 800);
        setMinimumSize(new Dimension(1024, 700));
        setLocationRelativeTo(null);
        getContentPane().setBackground(ModernTheme.BG_DARK);
        setLayout(new BorderLayout());

        // Build Top Bar
        add(buildHeaderPanel(), BorderLayout.NORTH);

        // Build Card Container
        cardLayout = new CardLayout();
        mainContainer = new JPanel(cardLayout);
        mainContainer.setBackground(ModernTheme.BG_DARK);

        mainContainer.add(buildPosPanel(), "POS");
        mainContainer.add(buildSalesPanel(), "SALES");
        mainContainer.add(buildMenuManagementPanel(), "MENU");

        add(mainContainer, BorderLayout.CENTER);

        // Start Live Clock Timer
        Timer timer = new Timer(1000, new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Date now = new Date();
                lblClock.setText(new SimpleDateFormat("dd MMM yyyy  |  hh:mm:ss a").format(now));
            }
        });
        timer.start();

        updateHeaderStats();
    }

    private JPanel buildHeaderPanel() {
        JPanel header = new JPanel(new BorderLayout(15, 0));
        header.setBackground(ModernTheme.PANEL_BG);
        header.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(0, 0, 2, 0, ModernTheme.PRIMARY_RED),
                new EmptyBorder(10, 20, 10, 20)
        ));

        // Brand Title
        JPanel brandPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        brandPanel.setOpaque(false);
        JLabel lblIcon = new JLabel("🍕");
        lblIcon.setFont(new Font("Segoe UI Emoji", Font.PLAIN, 28));
        JLabel lblTitle = new JLabel("CHEESY CRUST PIZZA");
        lblTitle.setFont(ModernTheme.FONT_TITLE);
        lblTitle.setForeground(ModernTheme.GOLD_ACCENT);

        JLabel lblTag = new JLabel("OFFLINE POS & SALES SYSTEM");
        lblTag.setFont(ModernTheme.FONT_SMALL);
        lblTag.setForeground(ModernTheme.TEXT_MUTED);

        JPanel titleBox = new JPanel(new GridLayout(2, 1));
        titleBox.setOpaque(false);
        titleBox.add(lblTitle);
        titleBox.add(lblTag);

        brandPanel.add(lblIcon);
        brandPanel.add(titleBox);

        // Center: Navigation Buttons
        JPanel navPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 0));
        navPanel.setOpaque(false);

        final JButton btnPosNav = ModernTheme.createPrimaryButton("🛒 Billing POS");
        final JButton btnSalesNav = ModernTheme.createSecondaryButton("📊 Total Sales & Reports");
        final JButton btnMenuNav = ModernTheme.createSecondaryButton("📋 Manage Menu");

        btnPosNav.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cardLayout.show(mainContainer, "POS");
                btnPosNav.setBackground(ModernTheme.PRIMARY_RED);
                btnSalesNav.setBackground(ModernTheme.CARD_BG);
                btnMenuNav.setBackground(ModernTheme.CARD_BG);
            }
        });

        btnSalesNav.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                refreshSalesTable();
                cardLayout.show(mainContainer, "SALES");
                btnSalesNav.setBackground(ModernTheme.PRIMARY_RED);
                btnPosNav.setBackground(ModernTheme.CARD_BG);
                btnMenuNav.setBackground(ModernTheme.CARD_BG);
            }
        });

        btnMenuNav.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                refreshMenuTable();
                cardLayout.show(mainContainer, "MENU");
                btnMenuNav.setBackground(ModernTheme.PRIMARY_RED);
                btnPosNav.setBackground(ModernTheme.CARD_BG);
                btnSalesNav.setBackground(ModernTheme.CARD_BG);
            }
        });

        navPanel.add(btnPosNav);
        navPanel.add(btnSalesNav);
        navPanel.add(btnMenuNav);

        // Right side: Quick stats badge & Clock
        JPanel rightPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 15, 0));
        rightPanel.setOpaque(false);

        JPanel statPill = new JPanel(new GridLayout(2, 1));
        statPill.setBackground(ModernTheme.CARD_BG);
        statPill.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(ModernTheme.BORDER_COLOR, 1, true),
                new EmptyBorder(4, 12, 4, 12)
        ));
        lblTodaySalesHeader = new JLabel("Today's Sales: Rs. 0.00");
        lblTodaySalesHeader.setFont(ModernTheme.FONT_BODY_BOLD);
        lblTodaySalesHeader.setForeground(ModernTheme.SUCCESS_GREEN);

        lblTodayOrdersHeader = new JLabel("Orders: 0");
        lblTodayOrdersHeader.setFont(ModernTheme.FONT_SMALL);
        lblTodayOrdersHeader.setForeground(ModernTheme.TEXT_MUTED);

        statPill.add(lblTodaySalesHeader);
        statPill.add(lblTodayOrdersHeader);

        lblClock = new JLabel("---");
        lblClock.setFont(ModernTheme.FONT_BODY_BOLD);
        lblClock.setForeground(ModernTheme.TEXT_MAIN);

        rightPanel.add(statPill);
        rightPanel.add(lblClock);

        header.add(brandPanel, BorderLayout.WEST);
        header.add(navPanel, BorderLayout.CENTER);
        header.add(rightPanel, BorderLayout.EAST);

        return header;
    }

    // =========================================================================
    // TAB 1: POS BILLING SCREEN
    // =========================================================================
    private JPanel buildPosPanel() {
        JPanel posPanel = new JPanel(new BorderLayout(10, 0));
        posPanel.setBackground(ModernTheme.BG_DARK);
        posPanel.setBorder(new EmptyBorder(10, 15, 10, 15));

        // LEFT: Category bar + Menu Grid
        JPanel leftPanel = new JPanel(new BorderLayout(0, 10));
        leftPanel.setBackground(ModernTheme.BG_DARK);

        // Category Filter Buttons
        JPanel catPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 0));
        catPanel.setOpaque(false);
        String[] categories = {"All", "Pizza", "Sides", "Beverages"};
        final List<JButton> catButtons = new ArrayList<JButton>();

        for (final String cat : categories) {
            final JButton b = ModernTheme.createSecondaryButton(cat.equals("Pizza") ? "🍕 Pizza" : (cat.equals("Sides") ? "🍟 Sides" : (cat.equals("Beverages") ? "🥤 Drinks" : "⭐ All Items")));
            if (cat.equals("All")) {
                b.setBackground(ModernTheme.PRIMARY_RED);
                b.setForeground(Color.WHITE);
            }
            b.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    selectedCategory = cat;
                    for (JButton btn : catButtons) {
                        btn.setBackground(ModernTheme.CARD_BG);
                        btn.setForeground(ModernTheme.TEXT_MAIN);
                    }
                    b.setBackground(ModernTheme.PRIMARY_RED);
                    b.setForeground(Color.WHITE);
                    renderMenuCards();
                }
            });
            catButtons.add(b);
            catPanel.add(b);
        }
        leftPanel.add(catPanel, BorderLayout.NORTH);

        // Menu Cards Grid (Scrollable)
        menuItemsPanel = new JPanel();
        menuItemsPanel.setBackground(ModernTheme.BG_DARK);
        menuItemsPanel.setLayout(new GridLayout(0, 3, 10, 10));

        JScrollPane menuScroll = new JScrollPane(menuItemsPanel);
        menuScroll.setBorder(null);
        menuScroll.setBackground(ModernTheme.BG_DARK);
        menuScroll.getViewport().setBackground(ModernTheme.BG_DARK);
        menuScroll.getVerticalScrollBar().setUnitIncrement(16);

        leftPanel.add(menuScroll, BorderLayout.CENTER);

        // RIGHT: Cart & Order Panel
        JPanel rightPanel = buildCartPanel();

        posPanel.add(leftPanel, BorderLayout.CENTER);
        posPanel.add(rightPanel, BorderLayout.EAST);

        renderMenuCards();
        return posPanel;
    }

    private void renderMenuCards() {
        menuItemsPanel.removeAll();
        List<MenuItem> items = dataManager.getMenuItems();

        for (final MenuItem item : items) {
            if (!selectedCategory.equals("All") && !item.getCategory().equalsIgnoreCase(selectedCategory)) {
                continue;
            }

            JPanel card = new JPanel(new BorderLayout(5, 5));
            card.setBackground(ModernTheme.CARD_BG);
            card.setBorder(BorderFactory.createCompoundBorder(
                    new LineBorder(ModernTheme.BORDER_COLOR, 1, true),
                    new EmptyBorder(10, 10, 10, 10)
            ));

            // Title & Icon
            JLabel lblItemName = new JLabel(item.getName());
            lblItemName.setFont(ModernTheme.FONT_SUBHEADER);
            lblItemName.setForeground(ModernTheme.TEXT_MAIN);

            JLabel lblDesc = new JLabel("<html><body style='width: 170px; color: #94A3B8; font-size: 10px;'>" + item.getDescription() + "</body></html>");

            JPanel topBox = new JPanel(new BorderLayout());
            topBox.setOpaque(false);
            topBox.add(lblItemName, BorderLayout.NORTH);
            topBox.add(lblDesc, BorderLayout.CENTER);

            // Bottom price & Add button
            JPanel bottomBox = new JPanel(new BorderLayout(5, 0));
            bottomBox.setOpaque(false);

            String priceStr;
            if (item.isPizza()) {
                priceStr = "From Rs. " + (int)item.getPriceSmall();
            } else {
                priceStr = "Rs. " + (int)item.getSinglePrice();
            }
            JLabel lblPrice = new JLabel(priceStr);
            lblPrice.setFont(ModernTheme.FONT_BODY_BOLD);
            lblPrice.setForeground(ModernTheme.GOLD_ACCENT);

            JButton btnAdd = ModernTheme.createPrimaryButton(item.isPizza() ? "Choose Size" : "+ Add");
            btnAdd.setFont(ModernTheme.FONT_SMALL);
            btnAdd.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent e) {
                    if (item.isPizza()) {
                        showPizzaCustomizationDialog(item);
                    } else {
                        addItemToCart(new CartItem(item.getId(), item.getName(), "-", "-", 0, item.getSinglePrice(), 1));
                    }
                }
            });

            bottomBox.add(lblPrice, BorderLayout.WEST);
            bottomBox.add(btnAdd, BorderLayout.EAST);

            card.add(topBox, BorderLayout.CENTER);
            card.add(bottomBox, BorderLayout.SOUTH);

            menuItemsPanel.add(card);
        }

        menuItemsPanel.revalidate();
        menuItemsPanel.repaint();
    }

    private void showPizzaCustomizationDialog(final MenuItem item) {
        final JDialog dialog = new JDialog(this, "Select Size & Crust: " + item.getName(), true);
        dialog.setSize(440, 360);
        dialog.setLocationRelativeTo(this);
        dialog.setLayout(new BorderLayout());
        dialog.getContentPane().setBackground(ModernTheme.PANEL_BG);

        JPanel content = new JPanel();
        content.setLayout(new BoxLayout(content, BoxLayout.Y_AXIS));
        content.setBackground(ModernTheme.PANEL_BG);
        content.setBorder(new EmptyBorder(15, 20, 15, 20));

        JLabel lblTitle = new JLabel(item.getName());
        lblTitle.setFont(ModernTheme.FONT_HEADER);
        lblTitle.setForeground(ModernTheme.GOLD_ACCENT);
        content.add(lblTitle);
        content.add(Box.createVerticalStrut(12));

        // Size radio buttons
        JLabel lblSize = new JLabel("1. Select Size:");
        lblSize.setFont(ModernTheme.FONT_BODY_BOLD);
        lblSize.setForeground(ModernTheme.TEXT_MAIN);
        content.add(lblSize);
        content.add(Box.createVerticalStrut(6));

        final JRadioButton rbSmall = new JRadioButton("Small (" + (int)item.getPriceSmall() + " Rs)");
        final JRadioButton rbMedium = new JRadioButton("Medium (" + (int)item.getPriceMedium() + " Rs)");
        final JRadioButton rbLarge = new JRadioButton("Large (" + (int)item.getPriceLarge() + " Rs)");
        final JRadioButton rbFamily = new JRadioButton("Family (" + (int)item.getPriceFamily() + " Rs)");
        rbMedium.setSelected(true);

        ButtonGroup sizeGroup = new ButtonGroup();
        sizeGroup.add(rbSmall);
        sizeGroup.add(rbMedium);
        sizeGroup.add(rbLarge);
        sizeGroup.add(rbFamily);

        for (JRadioButton rb : new JRadioButton[]{rbSmall, rbMedium, rbLarge, rbFamily}) {
            rb.setOpaque(false);
            rb.setForeground(ModernTheme.TEXT_MAIN);
            rb.setFont(ModernTheme.FONT_BODY);
            content.add(rb);
        }

        content.add(Box.createVerticalStrut(12));

        // Crust Selection
        JLabel lblCrust = new JLabel("2. Crust Choice:");
        lblCrust.setFont(ModernTheme.FONT_BODY_BOLD);
        lblCrust.setForeground(ModernTheme.TEXT_MAIN);
        content.add(lblCrust);
        content.add(Box.createVerticalStrut(6));

        final JComboBox<String> cbCrust = new JComboBox<String>(new String[]{
                "Regular Pan Crust (+Rs 0)",
                "Stuffed Cheese Crust (+Rs 200)",
                "Thin Crispy Crust (+Rs 0)"
        });
        cbCrust.setFont(ModernTheme.FONT_BODY);
        cbCrust.setBackground(ModernTheme.CARD_BG);
        cbCrust.setForeground(ModernTheme.TEXT_MAIN);
        content.add(cbCrust);

        dialog.add(content, BorderLayout.CENTER);

        // Buttons
        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));
        btnPanel.setBackground(ModernTheme.PANEL_BG);
        JButton btnAdd = ModernTheme.createPrimaryButton("Add to Order");
        JButton btnCancel = ModernTheme.createSecondaryButton("Cancel");

        btnAdd.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String size = "Medium";
                double price = item.getPriceMedium();
                if (rbSmall.isSelected()) { size = "Small"; price = item.getPriceSmall(); }
                else if (rbLarge.isSelected()) { size = "Large"; price = item.getPriceLarge(); }
                else if (rbFamily.isSelected()) { size = "Family"; price = item.getPriceFamily(); }

                String crustChoice = (String) cbCrust.getSelectedItem();
                double crustPrice = 0;
                String crustName = "Regular Pan";
                if (crustChoice != null && crustChoice.contains("200")) {
                    crustPrice = 200;
                    crustName = "Stuffed Cheese Crust";
                } else if (crustChoice != null && crustChoice.contains("Thin")) {
                    crustName = "Thin Crispy Crust";
                }

                addItemToCart(new CartItem(item.getId(), item.getName(), size, crustName, crustPrice, price, 1));
                dialog.dispose();
            }
        });

        btnCancel.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dialog.dispose();
            }
        });

        btnPanel.add(btnCancel);
        btnPanel.add(btnAdd);
        dialog.add(btnPanel, BorderLayout.SOUTH);

        dialog.setVisible(true);
    }

    private JPanel buildCartPanel() {
        JPanel cartPanel = new JPanel(new BorderLayout(0, 10));
        cartPanel.setPreferredSize(new Dimension(440, 0));
        cartPanel.setBackground(ModernTheme.PANEL_BG);
        cartPanel.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(ModernTheme.BORDER_COLOR, 1, true),
                new EmptyBorder(12, 12, 12, 12)
        ));

        // 1. Order Info Top Box
        JPanel orderInfoPanel = new JPanel(new GridLayout(4, 2, 8, 8));
        orderInfoPanel.setBackground(ModernTheme.PANEL_BG);
        orderInfoPanel.setBorder(BorderFactory.createTitledBorder(
                new LineBorder(ModernTheme.BORDER_COLOR), "Order Details",
                TitledBorder.LEFT, TitledBorder.TOP, ModernTheme.FONT_SUBHEADER, ModernTheme.GOLD_ACCENT
        ));

        cbOrderType = new JComboBox<String>(new String[]{"Dine-in", "Takeaway", "Delivery"});
        cbOrderType.setFont(ModernTheme.FONT_BODY);
        cbOrderType.setBackground(ModernTheme.CARD_BG);
        cbOrderType.setForeground(ModernTheme.TEXT_MAIN);

        txtCustomerName = ModernTheme.createTextField();
        txtCustomerName.setText("Walk-in Guest");

        txtCustomerPhone = ModernTheme.createTextField();

        lblTableOrAddress = new JLabel("Table No:");
        lblTableOrAddress.setForeground(ModernTheme.TEXT_MUTED);
        lblTableOrAddress.setFont(ModernTheme.FONT_BODY);

        txtTableOrAddress = ModernTheme.createTextField();
        txtTableOrAddress.setText("Table 1");

        cbOrderType.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String type = (String) cbOrderType.getSelectedItem();
                if ("Dine-in".equals(type)) {
                    lblTableOrAddress.setText("Table No:");
                    txtTableOrAddress.setText("Table 1");
                } else if ("Delivery".equals(type)) {
                    lblTableOrAddress.setText("Address:");
                    txtTableOrAddress.setText("");
                } else {
                    lblTableOrAddress.setText("Token / Note:");
                    txtTableOrAddress.setText("Takeaway");
                }
            }
        });

        JLabel l1 = new JLabel("Order Type:"); l1.setForeground(ModernTheme.TEXT_MUTED);
        JLabel l2 = new JLabel("Customer Name:"); l2.setForeground(ModernTheme.TEXT_MUTED);
        JLabel l3 = new JLabel("Phone No:"); l3.setForeground(ModernTheme.TEXT_MUTED);

        orderInfoPanel.add(l1); orderInfoPanel.add(cbOrderType);
        orderInfoPanel.add(l2); orderInfoPanel.add(txtCustomerName);
        orderInfoPanel.add(l3); orderInfoPanel.add(txtCustomerPhone);
        orderInfoPanel.add(lblTableOrAddress); orderInfoPanel.add(txtTableOrAddress);

        // 2. Cart Items Table
        String[] cols = {"Item & Size", "Qty", "Price", "Total"};
        cartTableModel = new DefaultTableModel(cols, 0) {
            @Override
            public boolean isCellEditable(int row, int col) { return false; }
        };
        cartTable = new JTable(cartTableModel);
        ModernTheme.styleTable(cartTable);
        cartTable.getColumnModel().getColumn(0).setPreferredWidth(170);
        cartTable.getColumnModel().getColumn(1).setPreferredWidth(45);
        cartTable.getColumnModel().getColumn(2).setPreferredWidth(65);
        cartTable.getColumnModel().getColumn(3).setPreferredWidth(75);

        JScrollPane cartScroll = new JScrollPane(cartTable);
        cartScroll.setBorder(new LineBorder(ModernTheme.BORDER_COLOR));
        cartScroll.getViewport().setBackground(ModernTheme.PANEL_BG);

        // Cart Actions (+, -, Remove)
        JPanel cartActionPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 5, 0));
        cartActionPanel.setOpaque(false);
        JButton btnPlus = ModernTheme.createSecondaryButton("➕ Qty");
        JButton btnMinus = ModernTheme.createSecondaryButton("➖ Qty");
        JButton btnRemove = ModernTheme.createSecondaryButton("🗑️ Remove");

        btnPlus.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                int row = cartTable.getSelectedRow();
                if (row >= 0 && row < cartItems.size()) {
                    CartItem it = cartItems.get(row);
                    it.setQuantity(it.getQuantity() + 1);
                    refreshCartTable();
                }
            }
        });

        btnMinus.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                int row = cartTable.getSelectedRow();
                if (row >= 0 && row < cartItems.size()) {
                    CartItem it = cartItems.get(row);
                    if (it.getQuantity() > 1) {
                        it.setQuantity(it.getQuantity() - 1);
                    } else {
                        cartItems.remove(row);
                    }
                    refreshCartTable();
                }
            }
        });

        btnRemove.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                int row = cartTable.getSelectedRow();
                if (row >= 0 && row < cartItems.size()) {
                    cartItems.remove(row);
                    refreshCartTable();
                }
            }
        });

        cartActionPanel.add(btnPlus);
        cartActionPanel.add(btnMinus);
        cartActionPanel.add(btnRemove);

        JPanel centerBox = new JPanel(new BorderLayout(0, 5));
        centerBox.setOpaque(false);
        centerBox.add(cartScroll, BorderLayout.CENTER);
        centerBox.add(cartActionPanel, BorderLayout.SOUTH);

        // 3. Payment & Calculation Panel
        JPanel calcPanel = new JPanel(new GridLayout(6, 2, 6, 6));
        calcPanel.setBackground(ModernTheme.PANEL_BG);
        calcPanel.setBorder(BorderFactory.createTitledBorder(
                new LineBorder(ModernTheme.BORDER_COLOR), "Bill Summary",
                TitledBorder.LEFT, TitledBorder.TOP, ModernTheme.FONT_SUBHEADER, ModernTheme.GOLD_ACCENT
        ));

        lblSubtotal = new JLabel("Rs. 0.00");
        lblSubtotal.setFont(ModernTheme.FONT_BODY_BOLD);
        lblSubtotal.setForeground(ModernTheme.TEXT_MAIN);

        txtDiscount = ModernTheme.createTextField();
        txtDiscount.setText("0");
        txtDiscount.getDocument().addDocumentListener(new DocumentListener() {
            public void insertUpdate(DocumentEvent e) { calculateTotals(); }
            public void removeUpdate(DocumentEvent e) { calculateTotals(); }
            public void changedUpdate(DocumentEvent e) { calculateTotals(); }
        });

        lblTax = new JLabel("Rs. 0.00");
        lblTax.setFont(ModernTheme.FONT_BODY);
        lblTax.setForeground(ModernTheme.TEXT_MUTED);

        lblGrandTotal = new JLabel("Rs. 0.00");
        lblGrandTotal.setFont(ModernTheme.FONT_STAT_NUM);
        lblGrandTotal.setForeground(ModernTheme.SUCCESS_GREEN);

        cbPaymentMethod = new JComboBox<String>(new String[]{"Cash", "Card", "Online (EasyPaisa/JazzCash)"});
        cbPaymentMethod.setFont(ModernTheme.FONT_BODY);
        cbPaymentMethod.setBackground(ModernTheme.CARD_BG);
        cbPaymentMethod.setForeground(ModernTheme.TEXT_MAIN);

        txtCashPaid = ModernTheme.createTextField();
        txtCashPaid.setText("0");
        txtCashPaid.getDocument().addDocumentListener(new DocumentListener() {
            public void insertUpdate(DocumentEvent e) { calculateTotals(); }
            public void removeUpdate(DocumentEvent e) { calculateTotals(); }
            public void changedUpdate(DocumentEvent e) { calculateTotals(); }
        });

        lblChangeReturn = new JLabel("Rs. 0.00");
        lblChangeReturn.setFont(ModernTheme.FONT_BODY_BOLD);
        lblChangeReturn.setForeground(ModernTheme.GOLD_ACCENT);

        JLabel s1 = new JLabel("Subtotal:"); s1.setForeground(ModernTheme.TEXT_MUTED);
        JLabel s2 = new JLabel("Discount (Rs):"); s2.setForeground(ModernTheme.TEXT_MUTED);
        JLabel s3 = new JLabel("Grand Total:"); s3.setFont(ModernTheme.FONT_HEADER); s3.setForeground(ModernTheme.TEXT_MAIN);
        JLabel s4 = new JLabel("Payment Mode:"); s4.setForeground(ModernTheme.TEXT_MUTED);
        JLabel s5 = new JLabel("Cash Given:"); s5.setForeground(ModernTheme.TEXT_MUTED);
        JLabel s6 = new JLabel("Change Return:"); s6.setForeground(ModernTheme.TEXT_MUTED);

        calcPanel.add(s1); calcPanel.add(lblSubtotal);
        calcPanel.add(s2); calcPanel.add(txtDiscount);
        calcPanel.add(s3); calcPanel.add(lblGrandTotal);
        calcPanel.add(s4); calcPanel.add(cbPaymentMethod);
        calcPanel.add(s5); calcPanel.add(txtCashPaid);
        calcPanel.add(s6); calcPanel.add(lblChangeReturn);

        // 4. Checkout Buttons
        JPanel bottomBtnPanel = new JPanel(new GridLayout(1, 2, 10, 0));
        bottomBtnPanel.setOpaque(false);

        JButton btnClear = ModernTheme.createSecondaryButton("❌ Clear Cart");
        JButton btnCheckout = ModernTheme.createSuccessButton("💳 Complete & Print");

        btnClear.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                clearCart();
            }
        });

        btnCheckout.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                processCheckout();
            }
        });

        bottomBtnPanel.add(btnClear);
        bottomBtnPanel.add(btnCheckout);

        JPanel footerBox = new JPanel(new BorderLayout(0, 10));
        footerBox.setOpaque(false);
        footerBox.add(calcPanel, BorderLayout.CENTER);
        footerBox.add(bottomBtnPanel, BorderLayout.SOUTH);

        cartPanel.add(orderInfoPanel, BorderLayout.NORTH);
        cartPanel.add(centerBox, BorderLayout.CENTER);
        cartPanel.add(footerBox, BorderLayout.SOUTH);

        return cartPanel;
    }

    private void addItemToCart(CartItem newItem) {
        // Check if matching item, size, and crust is already in cart
        boolean exists = false;
        for (CartItem it : cartItems) {
            if (it.getMenuItemId().equals(newItem.getMenuItemId()) &&
                it.getSize().equalsIgnoreCase(newItem.getSize()) &&
                it.getCrust().equalsIgnoreCase(newItem.getCrust())) {
                it.setQuantity(it.getQuantity() + newItem.getQuantity());
                exists = true;
                break;
            }
        }
        if (!exists) {
            cartItems.add(newItem);
        }
        refreshCartTable();
    }

    private void refreshCartTable() {
        cartTableModel.setRowCount(0);
        for (CartItem it : cartItems) {
            cartTableModel.addRow(new Object[]{
                    it.getDisplayName(),
                    it.getQuantity(),
                    currencyFmt.format(it.getEffectiveUnitPrice()),
                    currencyFmt.format(it.getTotalPrice())
            });
        }
        calculateTotals();
    }

    private void calculateTotals() {
        double subtotal = 0;
        for (CartItem it : cartItems) {
            subtotal += it.getTotalPrice();
        }

        double discount = 0;
        try {
            discount = Double.parseDouble(txtDiscount.getText().trim());
        } catch (Exception ignored) {}

        if (discount < 0) discount = 0;
        if (discount > subtotal) discount = subtotal;

        double grandTotal = subtotal - discount;

        double cashPaid = 0;
        try {
            cashPaid = Double.parseDouble(txtCashPaid.getText().trim());
        } catch (Exception ignored) {}

        double change = cashPaid - grandTotal;
        if (change < 0) change = 0;

        lblSubtotal.setText("Rs. " + currencyFmt.format(subtotal));
        lblGrandTotal.setText("Rs. " + currencyFmt.format(grandTotal));
        lblChangeReturn.setText("Rs. " + currencyFmt.format(change));
    }

    private void clearCart() {
        cartItems.clear();
        refreshCartTable();
        txtDiscount.setText("0");
        txtCashPaid.setText("0");
    }

    private void processCheckout() {
        if (cartItems.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Order is empty! Please add pizza or items first.", "Cart Empty", JOptionPane.WARNING_MESSAGE);
            return;
        }

        double subtotal = 0;
        for (CartItem it : cartItems) {
            subtotal += it.getTotalPrice();
        }

        double discount = 0;
        try {
            discount = Double.parseDouble(txtDiscount.getText().trim());
        } catch (Exception ignored) {}

        double grandTotal = Math.max(0, subtotal - discount);

        double cashPaid = 0;
        try {
            cashPaid = Double.parseDouble(txtCashPaid.getText().trim());
        } catch (Exception ignored) {}

        String payMethod = (String) cbPaymentMethod.getSelectedItem();
        if ("Cash".equals(payMethod) && cashPaid < grandTotal) {
            int choice = JOptionPane.showConfirmDialog(this,
                    "Cash Tendered (Rs. " + currencyFmt.format(cashPaid) + ") is less than Grand Total (Rs. " + currencyFmt.format(grandTotal) + "). Proceed anyway?",
                    "Cash Check", JOptionPane.YES_NO_OPTION);
            if (choice != JOptionPane.YES_OPTION) return;
        }

        double change = Math.max(0, cashPaid - grandTotal);

        Date now = new Date();
        String orderId = dataManager.generateNextOrderId();
        String dateStr = dateFormat.format(now);
        String timeStr = timeFormat.format(now);

        String custName = txtCustomerName.getText().trim();
        if (custName.isEmpty()) custName = "Walk-in Guest";
        String phone = txtCustomerPhone.getText().trim();
        String orderType = (String) cbOrderType.getSelectedItem();
        String tableOrAddr = txtTableOrAddress.getText().trim();

        String tableNum = "Dine-in".equals(orderType) ? tableOrAddr : "";
        String address = "Delivery".equals(orderType) ? tableOrAddr : "";

        Order order = new Order(
                orderId, dateStr, timeStr, now.getTime(),
                custName, phone, address, tableNum,
                orderType, payMethod, new ArrayList<CartItem>(cartItems),
                subtotal, discount, 0, grandTotal, cashPaid, change
        );

        // Save order completely offline
        dataManager.addOrder(order);

        // Update Header stats
        updateHeaderStats();

        // Show Receipt modal
        ReceiptDialog receiptDialog = new ReceiptDialog(this, order);
        receiptDialog.setVisible(true);

        // Reset cart for next order
        clearCart();
        txtCustomerName.setText("Walk-in Guest");
        txtCustomerPhone.setText("");
        if ("Dine-in".equals(orderType)) {
            txtTableOrAddress.setText("Table 1");
        }
    }

    private void updateHeaderStats() {
        lblTodaySalesHeader.setText("Today's Sales: Rs. " + currencyFmt.format(dataManager.getTodaySales()));
        lblTodayOrdersHeader.setText("Orders Today: " + dataManager.getTodayOrdersCount());
    }

    // =========================================================================
    // TAB 2: TOTAL SALES & REPORTS SCREEN
    // =========================================================================
    private JPanel buildSalesPanel() {
        JPanel salesPanel = new JPanel(new BorderLayout(0, 15));
        salesPanel.setBackground(ModernTheme.BG_DARK);
        salesPanel.setBorder(new EmptyBorder(15, 20, 15, 20));

        // 1. KPI Cards Row (Total Sales Information)
        JPanel kpiRow = new JPanel(new GridLayout(1, 5, 12, 0));
        kpiRow.setOpaque(false);

        lblKpiTotalSales = new JLabel("Rs. 0.00");
        lblKpiTodaySales = new JLabel("Rs. 0.00");
        lblKpiTotalOrders = new JLabel("0");
        lblKpiTodayOrders = new JLabel("0");
        lblKpiAvgOrder = new JLabel("Rs. 0.00");

        kpiRow.add(createKpiCard("💰 Total Sales (All Time)", lblKpiTotalSales, ModernTheme.GOLD_ACCENT));
        kpiRow.add(createKpiCard("📅 Today's Sales", lblKpiTodaySales, ModernTheme.SUCCESS_GREEN));
        kpiRow.add(createKpiCard("📦 Total Orders Count", lblKpiTotalOrders, ModernTheme.INFO_BLUE));
        kpiRow.add(createKpiCard("🍕 Today's Orders", lblKpiTodayOrders, ModernTheme.PRIMARY_RED));
        kpiRow.add(createKpiCard("📈 Average Order Value", lblKpiAvgOrder, Color.CYAN));

        // 2. Filter & Action Bar
        JPanel filterBar = new JPanel(new BorderLayout(10, 0));
        filterBar.setOpaque(false);

        JPanel leftFilter = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 0));
        leftFilter.setOpaque(false);

        JLabel lblFilter = new JLabel("Filter By:");
        lblFilter.setFont(ModernTheme.FONT_BODY_BOLD);
        lblFilter.setForeground(ModernTheme.TEXT_MAIN);

        cbSalesFilter = new JComboBox<String>(new String[]{"All Time", "Today Only"});
        cbSalesFilter.setFont(ModernTheme.FONT_BODY);
        cbSalesFilter.setBackground(ModernTheme.CARD_BG);
        cbSalesFilter.setForeground(ModernTheme.TEXT_MAIN);

        cbSalesFilter.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                refreshSalesTable();
            }
        });

        JLabel lblSearch = new JLabel("Search (ID/Name/Phone):");
        lblSearch.setFont(ModernTheme.FONT_BODY);
        lblSearch.setForeground(ModernTheme.TEXT_MUTED);

        txtSalesSearch = ModernTheme.createTextField();
        txtSalesSearch.setPreferredSize(new Dimension(180, 32));
        txtSalesSearch.getDocument().addDocumentListener(new DocumentListener() {
            public void insertUpdate(DocumentEvent e) { refreshSalesTable(); }
            public void removeUpdate(DocumentEvent e) { refreshSalesTable(); }
            public void changedUpdate(DocumentEvent e) { refreshSalesTable(); }
        });

        leftFilter.add(lblFilter);
        leftFilter.add(cbSalesFilter);
        leftFilter.add(lblSearch);
        leftFilter.add(txtSalesSearch);

        JPanel rightActions = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        rightActions.setOpaque(false);

        JButton btnViewReceipt = ModernTheme.createSecondaryButton("🧾 View / Reprint Receipt");
        JButton btnExportCsv = ModernTheme.createPrimaryButton("📊 Export to Excel / CSV");

        btnViewReceipt.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                int row = salesTable.getSelectedRow();
                if (row >= 0) {
                    String orderId = (String) salesTableModel.getValueAt(row, 0);
                    for (Order o : dataManager.getAllOrders()) {
                        if (o.getOrderId().equals(orderId)) {
                            new ReceiptDialog(MainFrame.this, o).setVisible(true);
                            break;
                        }
                    }
                } else {
                    JOptionPane.showMessageDialog(MainFrame.this, "Please select an order from the table first.", "Selection Needed", JOptionPane.INFORMATION_MESSAGE);
                }
            }
        });

        btnExportCsv.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                exportSalesData();
            }
        });

        rightActions.add(btnViewReceipt);
        rightActions.add(btnExportCsv);

        filterBar.add(leftFilter, BorderLayout.WEST);
        filterBar.add(rightActions, BorderLayout.EAST);

        // 3. Sales JTable
        String[] columns = {"Order ID", "Date", "Time", "Customer", "Type", "Items Ordered", "Subtotal", "Discount", "Grand Total", "Payment"};
        salesTableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int col) { return false; }
        };
        salesTable = new JTable(salesTableModel);
        ModernTheme.styleTable(salesTable);
        salesTable.getColumnModel().getColumn(0).setPreferredWidth(90);
        salesTable.getColumnModel().getColumn(1).setPreferredWidth(85);
        salesTable.getColumnModel().getColumn(2).setPreferredWidth(75);
        salesTable.getColumnModel().getColumn(3).setPreferredWidth(120);
        salesTable.getColumnModel().getColumn(4).setPreferredWidth(80);
        salesTable.getColumnModel().getColumn(5).setPreferredWidth(260);
        salesTable.getColumnModel().getColumn(8).setPreferredWidth(95);

        // Double-click row to open receipt
        salesTable.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    int row = salesTable.getSelectedRow();
                    if (row >= 0) {
                        String orderId = (String) salesTableModel.getValueAt(row, 0);
                        for (Order o : dataManager.getAllOrders()) {
                            if (o.getOrderId().equals(orderId)) {
                                new ReceiptDialog(MainFrame.this, o).setVisible(true);
                                break;
                            }
                        }
                    }
                }
            }
        });

        JScrollPane scrollPane = new JScrollPane(salesTable);
        scrollPane.setBorder(new LineBorder(ModernTheme.BORDER_COLOR));
        scrollPane.getViewport().setBackground(ModernTheme.PANEL_BG);

        salesPanel.add(kpiRow, BorderLayout.NORTH);

        JPanel tableWrapper = new JPanel(new BorderLayout(0, 10));
        tableWrapper.setOpaque(false);
        tableWrapper.add(filterBar, BorderLayout.NORTH);
        tableWrapper.add(scrollPane, BorderLayout.CENTER);

        salesPanel.add(tableWrapper, BorderLayout.CENTER);

        return salesPanel;
    }

    private JPanel createKpiCard(String title, JLabel valueLabel, Color accentColor) {
        JPanel card = new JPanel(new BorderLayout(5, 5));
        card.setBackground(ModernTheme.CARD_BG);
        card.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(0, 4, 0, 0, accentColor),
                new EmptyBorder(12, 14, 12, 14)
        ));

        JLabel lblTitle = new JLabel(title);
        lblTitle.setFont(ModernTheme.FONT_SMALL);
        lblTitle.setForeground(ModernTheme.TEXT_MUTED);

        valueLabel.setFont(ModernTheme.FONT_STAT_NUM);
        valueLabel.setForeground(accentColor);

        card.add(lblTitle, BorderLayout.NORTH);
        card.add(valueLabel, BorderLayout.CENTER);
        return card;
    }

    private void refreshSalesTable() {
        // Update KPI values
        lblKpiTotalSales.setText("Rs. " + currencyFmt.format(dataManager.getTotalSales()));
        lblKpiTodaySales.setText("Rs. " + currencyFmt.format(dataManager.getTodaySales()));
        lblKpiTotalOrders.setText(String.valueOf(dataManager.getTotalOrdersCount()));
        lblKpiTodayOrders.setText(String.valueOf(dataManager.getTodayOrdersCount()));
        lblKpiAvgOrder.setText("Rs. " + currencyFmt.format(dataManager.getAverageOrderValue()));

        salesTableModel.setRowCount(0);
        String filter = (String) cbSalesFilter.getSelectedItem();
        String search = txtSalesSearch.getText().trim().toLowerCase();
        String todayStr = dateFormat.format(new Date());

        for (Order o : dataManager.getAllOrders()) {
            if ("Today Only".equals(filter) && !todayStr.equals(o.getDate())) {
                continue;
            }

            if (!search.isEmpty()) {
                boolean match = o.getOrderId().toLowerCase().contains(search) ||
                                (o.getCustomerName() != null && o.getCustomerName().toLowerCase().contains(search)) ||
                                (o.getCustomerPhone() != null && o.getCustomerPhone().toLowerCase().contains(search));
                if (!match) continue;
            }

            salesTableModel.addRow(new Object[]{
                    o.getOrderId(),
                    o.getDate(),
                    o.getTime(),
                    o.getCustomerName(),
                    o.getOrderType(),
                    o.getItemsSummary(),
                    "Rs. " + currencyFmt.format(o.getSubtotal()),
                    "Rs. " + currencyFmt.format(o.getDiscountAmount()),
                    "Rs. " + currencyFmt.format(o.getGrandTotal()),
                    o.getPaymentMethod()
            });
        }
    }

    private void exportSalesData() {
        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Save Sales Report CSV");
        fileChooser.setSelectedFile(new File("SalesReport_" + dateFormat.format(new Date()) + ".csv"));

        int userSelection = fileChooser.showSaveDialog(this);
        if (userSelection == JFileChooser.APPROVE_OPTION) {
            File fileToSave = fileChooser.getSelectedFile();
            if (!fileToSave.getName().toLowerCase().endsWith(".csv")) {
                fileToSave = new File(fileToSave.getParentFile(), fileToSave.getName() + ".csv");
            }
            boolean success = dataManager.exportSalesToCSV(fileToSave);
            if (success) {
                JOptionPane.showMessageDialog(this, "Sales report successfully exported to:\n" + fileToSave.getAbsolutePath(), "Export Successful", JOptionPane.INFORMATION_MESSAGE);
            } else {
                JOptionPane.showMessageDialog(this, "Failed to export sales report.", "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    // =========================================================================
    // TAB 3: MENU MANAGEMENT SCREEN
    // =========================================================================
    private JPanel buildMenuManagementPanel() {
        JPanel menuPanel = new JPanel(new BorderLayout(0, 15));
        menuPanel.setBackground(ModernTheme.BG_DARK);
        menuPanel.setBorder(new EmptyBorder(15, 20, 15, 20));

        // Top bar: Add Item & Delete Item buttons
        JPanel topBar = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        topBar.setOpaque(false);

        JButton btnAddNew = ModernTheme.createPrimaryButton("➕ Add New Pizza / Side");
        JButton btnDelete = ModernTheme.createSecondaryButton("🗑️ Delete Selected");

        btnAddNew.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                showAddMenuItemDialog();
            }
        });

        btnDelete.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                int row = menuTable.getSelectedRow();
                if (row >= 0) {
                    String id = (String) menuTableModel.getValueAt(row, 0);
                    int confirm = JOptionPane.showConfirmDialog(MainFrame.this, "Are you sure you want to delete item [" + id + "]?", "Confirm Delete", JOptionPane.YES_NO_OPTION);
                    if (confirm == JOptionPane.YES_OPTION) {
                        dataManager.removeMenuItem(id);
                        refreshMenuTable();
                        renderMenuCards();
                    }
                } else {
                    JOptionPane.showMessageDialog(MainFrame.this, "Please select an item from table to delete.", "Select Item", JOptionPane.INFORMATION_MESSAGE);
                }
            }
        });

        topBar.add(btnAddNew);
        topBar.add(btnDelete);

        // Menu Table
        String[] cols = {"ID", "Item Name", "Category", "Description", "Small (Rs)", "Medium/Regular (Rs)", "Large (Rs)", "Family (Rs)"};
        menuTableModel = new DefaultTableModel(cols, 0) {
            @Override
            public boolean isCellEditable(int row, int col) { return false; }
        };
        menuTable = new JTable(menuTableModel);
        ModernTheme.styleTable(menuTable);

        JScrollPane scrollPane = new JScrollPane(menuTable);
        scrollPane.setBorder(new LineBorder(ModernTheme.BORDER_COLOR));
        scrollPane.getViewport().setBackground(ModernTheme.PANEL_BG);

        menuPanel.add(topBar, BorderLayout.NORTH);
        menuPanel.add(scrollPane, BorderLayout.CENTER);

        return menuPanel;
    }

    private void refreshMenuTable() {
        menuTableModel.setRowCount(0);
        for (MenuItem it : dataManager.getMenuItems()) {
            if (it.isPizza()) {
                menuTableModel.addRow(new Object[]{
                        it.getId(),
                        it.getName(),
                        it.getCategory(),
                        it.getDescription(),
                        currencyFmt.format(it.getPriceSmall()),
                        currencyFmt.format(it.getPriceMedium()),
                        currencyFmt.format(it.getPriceLarge()),
                        currencyFmt.format(it.getPriceFamily())
                });
            } else {
                menuTableModel.addRow(new Object[]{
                        it.getId(),
                        it.getName(),
                        it.getCategory(),
                        it.getDescription(),
                        "-",
                        currencyFmt.format(it.getSinglePrice()),
                        "-",
                        "-"
                });
            }
        }
    }

    private void showAddMenuItemDialog() {
        final JDialog dialog = new JDialog(this, "Add New Menu Item", true);
        dialog.setSize(480, 500);
        dialog.setLocationRelativeTo(this);
        dialog.setLayout(new BorderLayout());
        dialog.getContentPane().setBackground(ModernTheme.PANEL_BG);

        JPanel form = new JPanel(new GridLayout(8, 2, 10, 10));
        form.setBackground(ModernTheme.PANEL_BG);
        form.setBorder(new EmptyBorder(20, 20, 20, 20));

        final JTextField txtId = ModernTheme.createTextField();
        txtId.setText("P" + (dataManager.getMenuItems().size() + 1));
        final JTextField txtName = ModernTheme.createTextField();
        final JComboBox<String> cbCategory = new JComboBox<String>(new String[]{"Pizza", "Sides", "Beverages"});
        cbCategory.setFont(ModernTheme.FONT_BODY);
        final JTextField txtDesc = ModernTheme.createTextField();

        final JTextField txtPriceSmall = ModernTheme.createTextField();
        final JTextField txtPriceMed = ModernTheme.createTextField();
        final JTextField txtPriceLarge = ModernTheme.createTextField();
        final JTextField txtPriceFam = ModernTheme.createTextField();

        form.add(new JLabel("Item ID:")); form.add(txtId);
        form.add(new JLabel("Item Name:")); form.add(txtName);
        form.add(new JLabel("Category:")); form.add(cbCategory);
        form.add(new JLabel("Description:")); form.add(txtDesc);
        form.add(new JLabel("Small / Single Price (Rs):")); form.add(txtPriceSmall);
        form.add(new JLabel("Medium Price (Rs):")); form.add(txtPriceMed);
        form.add(new JLabel("Large Price (Rs):")); form.add(txtPriceLarge);
        form.add(new JLabel("Family Price (Rs):")); form.add(txtPriceFam);

        for (Component c : form.getComponents()) {
            if (c instanceof JLabel) {
                c.setForeground(ModernTheme.TEXT_MAIN);
                ((JLabel) c).setFont(ModernTheme.FONT_BODY);
            }
        }

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));
        btnPanel.setBackground(ModernTheme.PANEL_BG);
        JButton btnSave = ModernTheme.createPrimaryButton("Save Item");
        JButton btnCancel = ModernTheme.createSecondaryButton("Cancel");

        btnSave.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String id = txtId.getText().trim();
                String name = txtName.getText().trim();
                String cat = (String) cbCategory.getSelectedItem();
                String desc = txtDesc.getText().trim();

                if (name.isEmpty()) {
                    JOptionPane.showMessageDialog(dialog, "Please enter item name.");
                    return;
                }

                try {
                    if ("Pizza".equalsIgnoreCase(cat)) {
                        double s = Double.parseDouble(txtPriceSmall.getText().trim());
                        double m = Double.parseDouble(txtPriceMed.getText().trim());
                        double l = Double.parseDouble(txtPriceLarge.getText().trim());
                        double f = Double.parseDouble(txtPriceFam.getText().trim());
                        dataManager.addMenuItem(new MenuItem(id, name, cat, desc, s, m, l, f));
                    } else {
                        double price = Double.parseDouble(txtPriceSmall.getText().trim());
                        dataManager.addMenuItem(new MenuItem(id, name, cat, desc, price));
                    }
                    refreshMenuTable();
                    renderMenuCards();
                    dialog.dispose();
                } catch (Exception ex) {
                    JOptionPane.showMessageDialog(dialog, "Please enter valid numeric prices.");
                }
            }
        });

        btnCancel.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dialog.dispose();
            }
        });

        btnPanel.add(btnCancel);
        btnPanel.add(btnSave);

        dialog.add(form, BorderLayout.CENTER);
        dialog.add(btnPanel, BorderLayout.SOUTH);
        dialog.setVisible(true);
    }
}
