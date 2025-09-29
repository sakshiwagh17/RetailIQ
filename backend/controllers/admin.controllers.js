import { getpool } from "../lib/db.js";

// Dashboard counts
export const getCounts = async (req, res) => {
  const { id, role } = req.body;
  if (!id) {
    return res.json({ success: false, message: "You must login first" });
  }

  if (role !== "admin") {
    return res.json({
      success: false,
      message: "Users / ShopKeepers can't access admin routes",
    });
  }

  try {
    const pool = getpool();
    if (!pool) {
      return res.json({ success: false, message: "Database not exists" });
    }

    const [uc] = await pool.query("SELECT COUNT(*) AS cnt FROM users");
    const [sc] = await pool.query("SELECT COUNT(*) AS cnt FROM stores");
    const [rc] = await pool.query("SELECT COUNT(*) AS cnt FROM ratings");

    res.json({
      success: true,
      message: "Counts fetched successfully",
      counts: {
        userCount: uc[0].cnt,
        storeCount: sc[0].cnt,
        ratingCount: rc[0].cnt,
      },
    });
  } catch (error) {
    console.error("Error in getCounts:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  const { id, role } = req.body;
  if (!id) return res.json({ success: false, message: "You must login first" });
  if (role !== "admin") {
    return res.json({
      success: false,
      message: "Users / ShopKeepers can't access admin routes",
    });
  }

  try {
    const pool = getpool();
    const [users] = await pool.query(
      "SELECT id, name, email, address, role FROM users"
    );

    res.json({ success: true, message: "All users", users });
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

// Get all stores with avg ratings
export const getStores = async (req, res) => {
  const { id, role } = req.body;
  if (!id) return res.json({ success: false, message: "You must login first" });
  if (role !== "admin") {
    return res.json({
      success: false,
      message: "Users / ShopKeepers can't access admin routes",
    });
  }

  try {
    const pool = getpool();
    const [stores] = await pool.query(
      "SELECT s.id, s.name AS store_name, s.email AS store_email,  s.address AS store_address,   IFNULL(AVG(r.rating), 0) AS avg_rating  FROM stores s LEFT JOIN ratings r ON s.id = r.store_id GROUP BY s.id, s.name, s.email, s.address"
    );

    res.json({ success: true, message: "All stores", stores });
  } catch (error) {
    console.error("Error in getStores:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

//to update the user

export const updateUser = async (req, res) => {
  const { id, role } = req.body; // admin making request
  const { userId, name, address, role: newRole } = req.body;

  if (role !== "admin") {
    return res.json({ success: false, message: "Not authorized" });
  }

  try {
    const pool = getpool();
    await pool.query("UPDATE users SET name=?, address=?, role=? WHERE id=?", [
      name,
      address,
      newRole,
      userId,
    ]);
    res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

//to update the the stores

export const updateStores = async (req, res) => {
  const { id, role } = req.body; // admin making the request
  const { storeId, name, address } = req.body;
  if (role !== "admin") {
    return res.json({ success: false, message: "Not authorized" });
  }
  try {
    const pool = getpool();
    await pool.query("UPDATE stores SET name=?, address=? WHERE id=?", [
      name,
      address,
      storeId,
    ]);
    res.json({ success: true, message: "Stores updated successfully" });
  } catch (error) {
    console.error("Error in updateStores", error);
    res.json({ success: false, message: "Internal server error" });
  }
};
