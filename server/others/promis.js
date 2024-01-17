var p = new Promise((resolve, reject) => {
  //reject(new Error("have error"))

  setTimeout(() => {
    resolve("have some value");
  }, 2000);
});

function reTiwitt(post) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`this message is reteitted ${post}`);
    }, 2000);
  });
}

p2 = Promise.resolve("hello");

var result = p
  .then((r) => reTiwitt(r))
  .then((calback) => {
    console.log(calback);
  });

p.then((r) => console.log(r));

Promise.all([p, p2]).then((r) => console.log(r));
