// 메뉴 등록
// 실행: node cafemenue.js
const { db, createApp, asyncHandler, integer, subjectName, start } = require("./sample_common");
const app = createApp();

app.get("/", asyncHandler(async (req, res) => {
  const [cafe_db024] = await db.execute("SELECT id, name, price, category FROM cafe_db024 ORDER BY id DESC");
  res.render("cafemenue", { cafe_db024 });
}));
app.post("/cafe_db024", asyncHandler(async (req, res) => {
  const name = subjectName(req.body.name);
  const price = integer(req.body.price);
  const category = subjectName(req.body.category);
  if (!name || [...name].length > 100 || price === null || price < -2147483648 || price > 2147483647 || category === null || !category || [...category].length > 100) {
    return res.status(400).render("sample_error", { message: "입력값 또는 대상 ID를 확인하세요." });
  }
  await db.execute("INSERT INTO cafe_db024 (name, price, category) VALUES (?, ?, ?)", [name, price, category]);
  res.redirect(303, "/");
}));

app.post("/cafe_db024/update", asyncHandler(async (req, res) => {
  const id = integer(req.body.id);
  const name = subjectName(req.body.name);
  const price = integer(req.body.price);
  const category = subjectName(req.body.category);
  if (id === null || id <= 0 || !name || [...name].length > 100 || price === null || price < -2147483648 || price > 2147483647) {
    return res.status(400).render("sample_error", { message: "입력값 또는 대상 ID를 확인하세요." });
  }
  const [result] = await db.execute("UPDATE cafe_db024 SET name = ?, price = ?, category = ?  WHERE id = ?", [name, price, category, id]);
  if (result.affectedRows === 0) return res.status(404).render("sample_error", { message: "입력값 또는 대상 ID를 확인하세요." });
  // POST ?? ? GET?? ???? ????? ?? ?? ??? ????.
  res.redirect(303, "/");
}));

app.post("/cafe_db024/delete", asyncHandler(async (req, res) => {
  const id = integer(req.body.id);

  if (id === null || id <= 0) {
    return res.status(400).render("sample_error", {
      message: "삭제할 메뉴 ID를 확인하세요."
    });
  }

  const [result] = await db.execute(
    "DELETE FROM cafe_db024 WHERE id = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).render("sample_error", {
      message: "삭제할 메뉴 ID가 없습니다."
    });
  }

  res.redirect(303, "/");
}));

start(app, "카페메뉴 CRUD");
