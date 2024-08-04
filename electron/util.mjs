export const each = (db, sql, params, executor) =>
  new Promise((resolve, reject) =>
    db.each(
      sql,
      params,
      (err, val) => {
        if (err) reject(err);
        executor(val);
      },
      (err, val) => {
        if (err) reject(err);
        resolve(val);
      }
    )
  );

export const run = (db, sql, params) =>
  new Promise((resolve, reject) =>
    db.run(sql, params, (err) => {
      if (err) reject(err);
      resolve();
    })
  );

export const run_multi = (db, sql, paramsList) =>
  new Promise((resolve, reject) => {
    const stmt = db.prepare(sql);

    for (const params of paramsList) {
      stmt.run(params);
    }
    stmt.finalize((err) => {
      if (err) reject(err);
      resolve();
    });
  });
