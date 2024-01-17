async function sendMove() {
  var customer = await getCustomer(1);
  console.log("Customer: ", customer);
  if (customer.isGold) {
    var movies = await getTopMovies();
    console.log("Top movies: ", movies);
    var sendemail = sendEmail(customer.email, movies);
    console.log("Email sent...");
  }
}
sendMove();

function getCustomer(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: "Mosh Hamedani",
        isGold: true,
        email: "email",
      });
    }, 4000);
  });
}

function getTopMovies() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(["movie1", "movie2"]);
    }, 4000);
  });
}

function sendEmail(email, movies) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
}
