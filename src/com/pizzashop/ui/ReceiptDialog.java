package com.pizzashop.ui;

import com.pizzashop.model.CartItem;
import com.pizzashop.model.Order;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.print.PrinterJob;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

public class ReceiptDialog extends JDialog {
    private final Order order;
    private final JTextArea receiptArea;

    public ReceiptDialog(Frame parent, Order order) {
        super(parent, "Thermal Receipt - " + order.getOrderId(), true);
        this.order = order;

        setSize(420, 600);
        setLocationRelativeTo(parent);
        setLayout(new BorderLayout());
        getContentPane().setBackground(ModernTheme.BG_DARK);

        receiptArea = new JTextArea();
        receiptArea.setFont(new Font("Consolas", Font.PLAIN, 12));
        receiptArea.setEditable(false);
        receiptArea.setBackground(new Color(254, 252, 247)); // Realistic receipt paper light cream
        receiptArea.setForeground(new Color(30, 30, 30));
        receiptArea.setBorder(new EmptyBorder(15, 20, 15, 20));

        String receiptText = generateReceiptText(order);
        receiptArea.setText(receiptText);
        receiptArea.setCaretPosition(0);

        JScrollPane scrollPane = new JScrollPane(receiptArea);
        scrollPane.setBorder(BorderFactory.createLineBorder(ModernTheme.BORDER_COLOR));
        add(scrollPane, BorderLayout.CENTER);

        // Buttons Bar
        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));
        btnPanel.setBackground(ModernTheme.PANEL_BG);
        btnPanel.setBorder(BorderFactory.createMatteBorder(1, 0, 0, 0, ModernTheme.BORDER_COLOR));

        JButton btnPrint = ModernTheme.createPrimaryButton("🖨️ Print Receipt");
        JButton btnSave = ModernTheme.createSecondaryButton("💾 Save Slip");
        JButton btnClose = ModernTheme.createSecondaryButton("Close");

        btnPrint.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                try {
                    boolean complete = receiptArea.print();
                    if (complete) {
                        JOptionPane.showMessageDialog(ReceiptDialog.this, "Receipt sent to printer!", "Printing", JOptionPane.INFORMATION_MESSAGE);
                    }
                } catch (Exception ex) {
                    JOptionPane.showMessageDialog(ReceiptDialog.this, "Printer Error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
                }
            }
        });

        btnSave.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                saveReceiptToFile();
            }
        });

        btnClose.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dispose();
            }
        });

        btnPanel.add(btnSave);
        btnPanel.add(btnPrint);
        btnPanel.add(btnClose);
        add(btnPanel, BorderLayout.SOUTH);
    }

    private void saveReceiptToFile() {
        try {
            File dir = new File("receipts");
            if (!dir.exists()) dir.mkdirs();
            File f = new File(dir, order.getOrderId() + ".txt");
            PrintWriter pw = new PrintWriter(new OutputStreamWriter(new FileOutputStream(f), "UTF-8"));
            pw.print(receiptArea.getText());
            pw.close();
            JOptionPane.showMessageDialog(this, "Receipt saved successfully in:\n" + f.getAbsolutePath(), "Saved", JOptionPane.INFORMATION_MESSAGE);
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Save error: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    public static String generateReceiptText(Order order) {
        StringBuilder sb = new StringBuilder();
        sb.append("=========================================\n");
        sb.append("          CHEESY CRUST PIZZA CO.         \n");
        sb.append("    Hot, Fresh & Delicious Every Slice   \n");
        sb.append("     Main Commercial Market, Plaza 4     \n");
        sb.append("           Tel: 0300-0000000             \n");
        sb.append("=========================================\n");
        sb.append(String.format("Order No : %-29s\n", order.getOrderId()));
        sb.append(String.format("Date/Time: %s %s\n", order.getDate(), order.getTime()));
        sb.append(String.format("Type     : %-29s\n", order.getOrderType()));

        if (order.getCustomerName() != null && !order.getCustomerName().isEmpty()) {
            sb.append(String.format("Customer : %-29s\n", order.getCustomerName()));
        }
        if (order.getCustomerPhone() != null && !order.getCustomerPhone().isEmpty()) {
            sb.append(String.format("Phone    : %-29s\n", order.getCustomerPhone()));
        }
        if (order.getTableNumber() != null && !order.getTableNumber().isEmpty()) {
            sb.append(String.format("Table #  : %-29s\n", order.getTableNumber()));
        }
        if (order.getCustomerAddress() != null && !order.getCustomerAddress().isEmpty()) {
            sb.append(String.format("Address  : %-29s\n", order.getCustomerAddress()));
        }

        sb.append("-----------------------------------------\n");
        sb.append(String.format("%-22s %4s %5s %7s\n", "ITEM", "QTY", "RATE", "TOTAL"));
        sb.append("-----------------------------------------\n");

        if (order.getItems() != null) {
            for (CartItem it : order.getItems()) {
                String lineName = it.getName();
                if (it.getSize() != null && !it.getSize().equals("-")) {
                    lineName += " (" + it.getSize() + ")";
                }
                if (lineName.length() > 22) {
                    lineName = lineName.substring(0, 20) + "..";
                }
                sb.append(String.format("%-22s %4d %5.0f %7.0f\n",
                        lineName, it.getQuantity(), it.getEffectiveUnitPrice(), it.getTotalPrice()));
                if (it.getCrust() != null && !it.getCrust().equals("-") && !it.getCrust().equals("Regular Pan")) {
                    sb.append("  * ").append(it.getCrust()).append("\n");
                }
            }
        }

        sb.append("-----------------------------------------\n");
        sb.append(String.format("%-28s Rs. %8.2f\n", "Subtotal:", order.getSubtotal()));
        if (order.getDiscountAmount() > 0) {
            sb.append(String.format("%-28s-Rs. %8.2f\n", "Discount:", order.getDiscountAmount()));
        }
        if (order.getTaxAmount() > 0) {
            sb.append(String.format("%-28s+Rs. %8.2f\n", "Tax/GST:", order.getTaxAmount()));
        }
        sb.append("=========================================\n");
        sb.append(String.format("%-28s Rs. %8.2f\n", "GRAND TOTAL:", order.getGrandTotal()));
        sb.append("=========================================\n");
        sb.append(String.format("Payment Mode : %-24s\n", order.getPaymentMethod()));
        if ("Cash".equalsIgnoreCase(order.getPaymentMethod())) {
            sb.append(String.format("Cash Received: Rs. %8.2f\n", order.getCashTendered()));
            sb.append(String.format("Change Return: Rs. %8.2f\n", order.getChangeAmount()));
        }
        sb.append("\n");
        sb.append("        THANK YOU FOR YOUR VISIT!        \n");
        sb.append("        Please visit us again soon       \n");
        sb.append("=========================================\n");
        return sb.toString();
    }
}
