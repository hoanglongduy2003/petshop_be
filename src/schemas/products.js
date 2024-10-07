import joi from "joi";
import connection from "../db";
export const productsSchema = joi.object({
  id: joi.number(),
  name: joi.string().required().messages({
    "string.empty": "Tên sản phẩm không được để trống",
    "any.required": "Tên sản phẩm là trường bắt buộc",
  }),
  description: joi.string().required().messages({
    "string.empty": " Mô tả không được để trống",
    "any.required": "Mô tả là trường bắt buộc",
  }),
  price: joi.number().required().messages({
    "string.empty": "Giá không được để trống",
    "any.required": "Giá là trường bắt buộc",
  }),
  img: joi.string().required().messages({
    "string.empty": "Ảnh không được để trống",
    "any.required": "Ảnh là trường bắt buộc",
  }),
  quantity: joi.number().required().messages({
    "Number.empty": " Số lượng không được để trống",
    "any.required": "Số lượng là trường bắt buộc",
  }),
  category_id: joi.number().required().messages({
    "string.empty": "ID danh mục không được để trống",
    "any.required": "ID danh mục là bắt buộc",
  }),
});

export const productsUpdateQuatitySchema = joi.object({
  id: joi.number(),
  quantity: joi.number().required().messages({
    "number.empty": "Số lượng không được để trống",
    "any.required": "Số lượng là trường bắt buộc",
  }),
});
export const checkDuplicate = (name) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) as count FROM products WHERE name = ?';
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