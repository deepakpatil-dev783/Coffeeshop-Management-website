export const getAnalyticsSummary = async (req, res) => {
  try {
    const { timeRange = 'this_month' } = req.query;

    const summary = {
      totalRevenue: 48920.50,
      totalOrders: 1420,
      totalCustomers: 890,
      averageOrderValue: 34.45,
      todayRevenue: 1845.20,
      monthlyRevenue: 34150.00,
      growthRate: '+18.4%',
      tableUtilizationRate: '78.5%'
    };

    const dailyRevenue = [
      { day: 'Mon', revenue: 1450, orders: 48 },
      { day: 'Tue', revenue: 1680, orders: 52 },
      { day: 'Wed', revenue: 1920, orders: 61 },
      { day: 'Thu', revenue: 2100, orders: 68 },
      { day: 'Fri', revenue: 2850, orders: 94 },
      { day: 'Sat', revenue: 3400, orders: 112 },
      { day: 'Sun', revenue: 3100, orders: 104 }
    ];

    const monthlyRevenue = [
      { month: 'Jan', revenue: 28000 },
      { month: 'Feb', revenue: 31200 },
      { month: 'Mar', revenue: 34500 },
      { month: 'Apr', revenue: 32900 },
      { month: 'May', revenue: 38400 },
      { month: 'Jun', revenue: 41200 },
      { month: 'Jul', revenue: 44800 },
      { month: 'Aug', revenue: 46200 },
      { month: 'Sep', revenue: 48920 }
    ];

    const categoryRevenue = [
      { category: 'Coffee', value: 42, color: '#6F4227' },
      { category: 'Cold Drinks', value: 24, color: '#D4A373' },
      { category: 'Snacks', value: 18, color: '#B07D4F' },
      { category: 'Desserts', value: 10, color: '#8B5A2B' },
      { category: 'Tea', value: 6, color: '#543322' }
    ];

    const topSellingProducts = [
      { name: 'Caramel Macchiato', sold: 482, revenue: 2646.18 },
      { name: 'Iced Cold Brew Vanilla Foam', sold: 395, revenue: 2287.05 },
      { name: 'Belgian Chocolate Croissant', sold: 341, revenue: 1531.09 },
      { name: 'Velvet Flat White', sold: 298, revenue: 1487.02 },
      { name: 'Matcha Green Tea Latte', sold: 215, revenue: 1137.35 }
    ];

    const peakHours = [
      { hour: '07:00', orders: 18 },
      { hour: '08:00', orders: 45 },
      { hour: '09:00', orders: 82 },
      { hour: '10:00', orders: 64 },
      { hour: '11:00', orders: 40 },
      { hour: '12:00', orders: 75 },
      { hour: '13:00', orders: 88 },
      { hour: '14:00', orders: 52 },
      { hour: '15:00', orders: 38 },
      { hour: '16:00', orders: 60 },
      { hour: '17:00', orders: 72 },
      { hour: '18:00', orders: 50 },
      { hour: '19:00', orders: 35 }
    ];

    const paymentMethods = [
      { name: 'Credit Card', percentage: 48 },
      { name: 'UPI / QR', percentage: 32 },
      { name: 'Apple Pay', percentage: 14 },
      { name: 'Cash', percentage: 6 }
    ];

    res.json({
      success: true,
      timeRange,
      summary,
      dailyRevenue,
      monthlyRevenue,
      categoryRevenue,
      topSellingProducts,
      peakHours,
      paymentMethods
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
