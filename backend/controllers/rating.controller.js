import { getpool } from "../lib/db.js";

export const addRating = async (req, res) => {
  const { rating, shopId } = req.body;
  const { id, email, name } = req.user; 

  // Validation
  if (!rating || !shopId || !id || !email || !name) {
    return res.json({
      success: false,
      message: "shopId are required and You must be signed in",
    });
  }

  //for rating should be in 1-5 
  if (rating < 1 || rating > 5) {
    return res.json({ success: false, message: "Rating must be between 1 and 5" });
  }

  try {
    const pool = getpool();
    if (!pool) {
      return res.json({
        success: false,
        message: "Database pool does not exist",
      });
    }

    // user already rated this store or not
    const [existingRating] = await pool.query(
      "SELECT * FROM ratings WHERE user_id=? AND store_id=?",
      [id, shopId]
    );

    if (existingRating.length > 0) {
      // Update rating if exists
      await pool.query(
        "UPDATE ratings SET rating=?, updated_at=NOW() WHERE user_id=? AND store_id=?",
        [rating, id, shopId]
      );
      return res.json({
        success: true,
        message: "Rating updated successfully",
      });
    } else {
      // Insert new rating
      await pool.query(
        "INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
        [id, shopId, rating]
      );
      return res.json({
        success: true,
        message: "Rating added successfully",
      });
    }
  } catch (error) {
    console.error("Error in addRating function", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

//get the users rating

export const getMyRating = async (req, res) => {
  const { shopId } = req.query;  // req.params.shopId if using URL params
  const { id } = req.user;  

  if (!id) {
    return res.json({
      success: false,
      message: "You must be logged in!",
    });
  }

  if (!shopId) {
    return res.json({
      success: false,
      message: "Shop ID is required!",
    });
  }

  try {
    const pool = getpool();
    if (!pool) {
      return res.json({
        success: false,
        message: "Database pool does not exist",
      });
    }

    const [rating] = await pool.query(
      "SELECT rating FROM ratings WHERE user_id=? AND store_id=?",
      [id, shopId]
    );

    if (rating.length === 0) {
      return res.json({
        success: true,
        message: "No rating found for this store",
        rating: null,
      });
    }

    res.json({
      success: true,
      message: "Rating fetched successfully",
      rating: rating[0].rating,
    });
  } catch (error) {
    console.error("Error in getMyRating:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};
