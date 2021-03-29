// ROUTES

exports.routes = app => {
 app.get("/", (req, res) => {
  res.render("../views/pages/index.ejs");
 });

 app.use("/logout", (req, res) => {
  delete req.session.user;
  res.redirect("/");
 });
};
