import connection from "../db";

export default class Dashboard {
  static getDashboard(year, month) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT COUNT(id) AS total_appointments, SUM(total) AS total_revenue FROM appointments WHERE appointments.status_payment = 2 AND appointments.status_id = 4 AND YEAR(appointments.start_time) = ? AND MONTH(appointments.start_time) = ?",
        [year, month],
        (err, results) => {
          if (err) reject(err);
          resolve(results[0]);
        }
      );
    });
  }

  
  static getSCheduleStatusAppointment() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT status_id,status_appointment.name, COUNT(*) as status_count FROM appointments JOIN status_appointment ON appointments.status_id = status_appointment.id GROUP BY status_id",
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });
  }
  static getSCheduleStatusOrder() {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT status_id,status_order.name, COUNT(*) as status_count FROM orders JOIN status_order ON orders.status_id = status_order.id GROUP BY status_id",
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });
  }
  static getMonthlyRevenue(year, month) {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT
        date_format(activity_date, '%m-%Y') AS activity_date,
        sum(total_appointments) AS total_appointments,
        sum(total_orders) AS total_orders,
        sum(total_appointments + total_orders) AS total_revenue
    FROM (
        SELECT
            start_time AS activity_date,
            total AS total_appointments,
            0 AS total_orders
        FROM
            appointments
        WHERE
            status_payment = 2 AND status_id = 4
    
        UNION ALL
    
        SELECT
            time AS activity_date,
            0 AS total_appointments,
            total AS total_orders
        FROM
            orders
        WHERE
            status_payment = 2 AND status_id = 4
    ) AS combined_data
    GROUP BY
        date_format(activity_date, '%Y%m')
    ORDER BY
      YEAR(activity_date) ASC, MONTH(activity_date) ASC;
    `,
        [year, month, year, month],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });
  }

  static getRevenueToday() {
    return new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT
          date_format(activity_date, '%m-%Y') AS activity_date,
          sum(total_appointments) AS total_appointments,
          sum(total_orders) AS total_orders,
          sum(total_appointments + total_orders) AS total_revenue
        FROM (
          SELECT
            start_time AS activity_date,
            total AS total_appointments,
            0 AS total_orders
          FROM
            appointments
          WHERE
            status_payment = 2 AND status_id = 4 AND DATE(start_time) = CURDATE()
  
          UNION ALL
  
          SELECT
            time AS activity_date,
            0 AS total_appointments,
            total AS total_orders
          FROM
            orders
          WHERE
            status_payment = 2 AND status_id = 4 AND DATE(time) = CURDATE()
        ) AS combined_data
        GROUP BY
          date_format(activity_date, '%m-%Y')
        ORDER BY
          YEAR(activity_date) DESC, MONTH(activity_date) DESC;
        `,
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  static getRevenueThisMonth() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT
        date_format(activity_date, '%m-%Y') AS activity_month,
        sum(total_appointments) AS total_appointments,
        sum(total_orders) AS total_orders,
        sum(total_appointments + total_orders) AS total_revenue
      FROM (
        SELECT
          start_time AS activity_date,
          total AS total_appointments,
          0 AS total_orders
        FROM
          appointments
        WHERE
          status_payment = 2 AND status_id = 4 AND MONTH(start_time) = MONTH(CURDATE()) AND YEAR(start_time) = YEAR(CURDATE())

        UNION ALL

        SELECT
          time AS activity_date,
          0 AS total_appointments,
          total AS total_orders
        FROM
          orders
        WHERE
          status_payment = 2 AND status_id = 4 AND MONTH(time) = MONTH(CURDATE()) AND YEAR(time) = YEAR(CURDATE())
      ) AS combined_data
      GROUP BY
        date_format(activity_date, '%m-%Y')
      ORDER BY
        YEAR(activity_date) DESC, MONTH(activity_date) DESC;
    `,
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });
  }
  static countUserDay() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) AS count FROM users WHERE DATE(create_at) = CURRENT_DATE;
        `,
        [],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });
  }

  static getRevenueAppointmentsToDay() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT DATE(start_time) AS activity_date, SUM(total) AS total_appointments FROM appointments WHERE status_payment = 2 AND status_id = 4 AND DATE(start_time) = CURDATE() GROUP BY DATE(start_time);
    `,
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });
  }
  static getRevenueAppointmentsThisMonth() {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT
        DATE_FORMAT(start_time, '%Y-%m') AS activity_month,
        SUM(total) AS total_appointments
      FROM
        appointments
      WHERE
        status_payment = 2 AND status_id = 4
      GROUP BY
        DATE_FORMAT(start_time, '%Y-%m');
      
    `,
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });
  }
}
