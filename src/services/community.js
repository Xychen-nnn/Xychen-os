const {get}=require('../database'),{newId}=require('../utils/ids');
const TYPES={reports:{table:'reports',prefix:'RPT',fields:['title','description'],statuses:['OPEN','INVESTIGATING','FIXED','CLOSED']},requests:{table:'requests',prefix:'REQ',fields:['title','description'],statuses:['OPEN','PLANNED','IN_PROGRESS','SHIPPED','DECLINED']},support:{table:'support_tickets',prefix:'SUP',fields:['subject','message'],statuses:['OPEN','WAITING','RESOLVED','CLOSED']}};
function publicUserId(){
  const db=get();
  db.prepare("INSERT OR IGNORE INTO users(username,email,password_hash,role) VALUES(?,?,?,'member')").run('public-submissions','public-submissions@xychen-os.invalid','!disabled-public-submission-account!');
  return db.prepare('SELECT id FROM users WHERE username=?').get('public-submissions').id;
}
function create(type,userId,a,b){
  const t=TYPES[type],id=newId(t.prefix),ownerId=userId||publicUserId();
  get().prepare(`INSERT INTO ${t.table}(public_id,user_id,${t.fields[0]},${t.fields[1]}) VALUES(?,?,?,?)`).run(id,ownerId,a,b);
  return get().prepare(`SELECT public_id,${t.fields[0]},status,created_at FROM ${t.table} WHERE public_id=?`).get(id);
}
function mine(type,userId){return get().prepare(`SELECT * FROM ${TYPES[type].table} WHERE user_id=? ORDER BY id DESC`).all(userId)}
function all(type){return get().prepare(`SELECT x.*,u.username FROM ${TYPES[type].table} x LEFT JOIN users u ON u.id=x.user_id ORDER BY x.id DESC`).all()}
function status(type,id,status){const t=TYPES[type];if(!t.statuses.includes(status))return null;get().prepare(`UPDATE ${t.table} SET status=?,updated_at=CURRENT_TIMESTAMP WHERE public_id=?`).run(status,id);return get().prepare(`SELECT * FROM ${t.table} WHERE public_id=?`).get(id)}
module.exports={TYPES,create,mine,all,status};
