const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');
const userData = require('./userData.json');
const postData = require('./postData.json');
const commentsData = require('./commentData.json');

const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");
  await sequelize.sync({ force: true });
  console.log("Database synchronization completed.");

  console.log("Seeding User data...");
  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  console.log("User data seeded successfully.");

  console.log("Seeding Post data...");
  // for (const post of postData) {
  //   await Post.create({
  //     ...post,
  //     user_id: users[Math.floor(Math.random() * users.length)].id,
  //   });
  // };
  const post = await Post.bulkCreate(postData, {
    individualHooks: true,
    returning: true,
  })
  console.log("Posts data seeded successfully.");

  console.log("Seeding Comment data...");
  const comments = await Comment.bulkCreate(commentsData, {
    returning: true,
  });
  console.log("Comment data seeded successfully.");


  process.exit(0);
} catch (error) {
  console.error("Error seeding database:", error);
  process.exit(1);
}
};

seedDatabase();