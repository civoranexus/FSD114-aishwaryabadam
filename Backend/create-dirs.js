const fs = require('fs');
const path = require('path');

const dirs = [
  './uploads',
  './uploads/course-thumbnail',
  './uploads/lesson-video',
  './uploads/lesson-file',
  './uploads/profile-picture',
  './uploads/general'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  } else {
    console.log(`📁 Directory already exists: ${dir}`);
  }
});

console.log('\n✅ All directories ready!');