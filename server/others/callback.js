console.log("before");
console.log("after");

//////promise approch
readUser(1)
  .then((user) => readPost(user))
  .then((post) => console.log(post));

////////////async waite aproch

async function showPosts() {
  var user = await readUser(1);
  var readPost = await readPost(user);
  console.log(`reading post : ${readPost}`);
}

function readUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("reading  user.........");
      resolve({ id: id, name: "abebe" });
    }, 2000);
  });
}
function readPost(user) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("reading the post.........");
      resolve(`hear is the post of ${user.name}`);
    }, 2000);
  });
}
