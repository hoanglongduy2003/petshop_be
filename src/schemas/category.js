import joi from "joi";
import connection from "../db";
export const categorySchema = joi.object({
  id: joi.number(),
  name: joi.string().required().messages({
    "string.empty": "Tên không được để trống",
  }),
});
export const checkCategoryDuplicate = (name) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) as count FROM category WHERE name = ?';
    connection.query(query, [name], (err, results) => {
      if (err) {
        return reject(err);
      }
      // Nếu số lượng lớn hơn 0 thì có trùng dữ liệu
      if (results[0].count > 0) {
        resolve(true); // Trùng dữ liệu
      } else {
        resolve(false); // Không trùng dữ liệu
      }
    });
  });
};