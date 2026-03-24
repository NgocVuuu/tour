const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    const routes = await mongoose.connection.collection('routes').find().toArray();
    console.log('Routes:', JSON.stringify(routes, null, 2));
    const blogs = await mongoose.connection.collection('blogposts').find().toArray();
    console.log('Blogs:', JSON.stringify(blogs, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
