package com.pizzashop.ui;

import javax.swing.*;
import javax.swing.border.Border;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.JTableHeader;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

public class ModernTheme {
    // Primary Colors
    public static final Color BG_DARK = new Color(18, 22, 28);
    public static final Color PANEL_BG = new Color(26, 32, 44);
    public static final Color CARD_BG = new Color(34, 42, 56);
    public static final Color CARD_HOVER = new Color(42, 52, 70);
    public static final Color BORDER_COLOR = new Color(45, 55, 72);

    // Accent Colors
    public static final Color PRIMARY_RED = new Color(229, 57, 53);      // Pizza Crimson
    public static final Color PRIMARY_HOVER = new Color(211, 47, 47);
    public static final Color GOLD_ACCENT = new Color(255, 167, 38);     // Cheesy Gold
    public static final Color SUCCESS_GREEN = new Color(16, 185, 129);   // Checkout Green
    public static final Color SUCCESS_HOVER = new Color(5, 150, 105);
    public static final Color INFO_BLUE = new Color(59, 130, 246);
    public static final Color DANGER_RED = new Color(239, 68, 68);

    // Text Colors
    public static final Color TEXT_MAIN = new Color(248, 250, 252);
    public static final Color TEXT_MUTED = new Color(148, 163, 184);
    public static final Color TEXT_DARK = new Color(30, 41, 59);

    // Fonts
    public static final Font FONT_TITLE = new Font("Segoe UI", Font.BOLD, 22);
    public static final Font FONT_HEADER = new Font("Segoe UI", Font.BOLD, 16);
    public static final Font FONT_SUBHEADER = new Font("Segoe UI", Font.BOLD, 14);
    public static final Font FONT_BODY = new Font("Segoe UI", Font.PLAIN, 13);
    public static final Font FONT_BODY_BOLD = new Font("Segoe UI", Font.BOLD, 13);
    public static final Font FONT_SMALL = new Font("Segoe UI", Font.PLAIN, 11);
    public static final Font FONT_STAT_NUM = new Font("Segoe UI", Font.BOLD, 24);
    public static final Font FONT_RECEIPT = new Font("Monospaced", Font.PLAIN, 12);

    public static JButton createPrimaryButton(String text) {
        return createStyledButton(text, PRIMARY_RED, PRIMARY_HOVER, Color.WHITE, FONT_BODY_BOLD);
    }

    public static JButton createSuccessButton(String text) {
        return createStyledButton(text, SUCCESS_GREEN, SUCCESS_HOVER, Color.WHITE, new Font("Segoe UI", Font.BOLD, 15));
    }

    public static JButton createSecondaryButton(String text) {
        return createStyledButton(text, CARD_BG, CARD_HOVER, TEXT_MAIN, FONT_BODY);
    }

    public static JButton createStyledButton(final String text, final Color normalBg, final Color hoverBg, final Color fg, final Font font) {
        final JButton button = new JButton(text);
        button.setFont(font);
        button.setForeground(fg);
        button.setBackground(normalBg);
        button.setFocusPainted(false);
        button.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(BORDER_COLOR, 1, true),
                new EmptyBorder(8, 16, 8, 16)
        ));
        button.setCursor(new Cursor(Cursor.HAND_CURSOR));
        button.setContentAreaFilled(false);
        button.setOpaque(true);

        button.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                button.setBackground(hoverBg);
            }
            @Override
            public void mouseExited(MouseEvent e) {
                button.setBackground(normalBg);
            }
        });
        return button;
    }

    public static JPanel createCardPanel() {
        JPanel panel = new JPanel();
        panel.setBackground(CARD_BG);
        panel.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(BORDER_COLOR, 1, true),
                new EmptyBorder(12, 12, 12, 12)
        ));
        return panel;
    }

    public static void styleTable(JTable table) {
        table.setBackground(PANEL_BG);
        table.setForeground(TEXT_MAIN);
        table.setFont(FONT_BODY);
        table.setRowHeight(32);
        table.setGridColor(BORDER_COLOR);
        table.setShowGrid(true);
        table.setShowVerticalLines(false);
        table.setSelectionBackground(CARD_HOVER);
        table.setSelectionForeground(GOLD_ACCENT);

        JTableHeader header = table.getTableHeader();
        header.setBackground(CARD_BG);
        header.setForeground(GOLD_ACCENT);
        header.setFont(FONT_SUBHEADER);
        header.setBorder(BorderFactory.createMatteBorder(0, 0, 2, 0, BORDER_COLOR));
        header.setPreferredSize(new Dimension(header.getWidth(), 36));

        DefaultTableCellRenderer centerRenderer = new DefaultTableCellRenderer();
        centerRenderer.setHorizontalAlignment(JLabel.CENTER);
        centerRenderer.setBackground(PANEL_BG);
        centerRenderer.setForeground(TEXT_MAIN);
    }

    public static JTextField createTextField() {
        JTextField tf = new JTextField();
        tf.setFont(FONT_BODY);
        tf.setBackground(CARD_BG);
        tf.setForeground(TEXT_MAIN);
        tf.setCaretColor(TEXT_MAIN);
        tf.setBorder(BorderFactory.createCompoundBorder(
                new LineBorder(BORDER_COLOR, 1, true),
                new EmptyBorder(6, 10, 6, 10)
        ));
        return tf;
    }

    public static JComboBox<String> createComboBox(String[] items) {
        JComboBox<String> cb = new JComboBox<String>(items);
        cb.setFont(FONT_BODY);
        cb.setBackground(CARD_BG);
        cb.setForeground(TEXT_MAIN);
        cb.setBorder(BorderFactory.createLineBorder(BORDER_COLOR));
        return cb;
    }
}
