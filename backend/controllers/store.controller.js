import { getpool } from "../lib/db.js";

//Registering the store
export const registerStores = async (req, res) => {
  const { shopName, shopAddress } = req.body;
  const { email, id } = req.user;

  try {
    if (!email || !id) {
      return res.json({ success: false, message: "User not found. Login first" });
    }

    if (!shopName || !shopAddress) {
      return res.json({ success: false, message: "Shop name and address are required" });
    }

    const pool = getpool();

    // user already owns a store
    const [existingShop] = await pool.query(
      "SELECT id FROM stores WHERE owner_id=?",
      [id]
    );
    if (existingShop.length > 0) {
      return res.json({ success: false, message: "You already own a store" });
    }

    // Insert store
    const [result] = await pool.query(
      "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
      [shopName, email, shopAddress, id]
    );

    // Update user role
    await pool.query('UPDATE users SET role="OWNER" WHERE id=?', [id]);

    // Fetch new store
    const [newShop] = await pool.query(
      "SELECT id, name, email, address FROM stores WHERE id=?",
      [result.insertId]
    );

    res.json({ success: true, message: "Shop created successfully", shop: newShop[0] });
  } catch (error) {
    console.error("Error in registerStores:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};


// to get all register store
export const getAllStores = async (req, res) => {
  try {
    const pool = getpool();
    if (!pool) {
      return res.json({
        success: false,
        message: "Database pool is not available",
      });
    }

    const [allstores] = await pool.query("SELECT * FROM stores");
    res.json({ success: true, message: "All Shops", allstores });
  } catch (error) {
    console.log("Error in getAllStores function", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

//to get Users shop and their rating
export const getStoresAndRating = async (req, res) => {
  const { id } = req.user; // from auth middleware

  try {
    if (!id) {
      return res.json({ success: false, message: "You must be logged in" });
    }

    const pool = getpool();

    // Get store of this owner
    const [shops] = await pool.query("SELECT id, name FROM stores WHERE owner_id=?", [id]);

    if (shops.length === 0) {
      return res.json({ success: true, message: "No store registered yet", store: null });
    }

    const store = shops[0];

    // Get users who rated this store
    const [storeRaters] = await pool.query(
      `SELECT u.name, r.rating
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id=?`,
      [store.id]
    );

    // get average rating
    const [avg] = await pool.query(
      "SELECT IFNULL(AVG(rating),0) AS avg_rating FROM ratings WHERE store_id=?",
      [store.id]
    );

    res.json({
      success: true,
      message: "Store and ratings fetched",
      store: {
        id: store.id,
        name: store.name,
        avg_rating: avg[0].avg_rating,
        raters: storeRaters,
      },
    });
  } catch (error) {
    console.error("Error in getStoresAndRating:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

