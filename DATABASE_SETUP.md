# NeoCart: Database Setup & Deployment Guide 🚀

NeoCart ko deploy karne se pehle humein ek cloud database (MongoDB Atlas) chaiye takki apki website kahin se bhi access ho sake.

## Step 1: MongoDB Atlas Setup (Cloud Database)

1. **Register:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) par free account banayein.
2. **Create Cluster:** "Build a Database" par click karein aur **M0 (Free)** tier select karein. Provider (AWS/Google Cloud) aur Region (Mumbai/Singapore) default rehne dein.
3. **Database Access:** 
   - Ek **Username** aur **Password** create karein. Is password ko yaad rakhein.
4. **Network Access:** 
   - `Add IP Address` par click karein aur `0.0.0.0/0` (Allow access from anywhere) select karein. Taaki Render/Vercel isse access kar sakein.
5. **Get Connection String:**
   - Dashboard par `Connect` -> `Drivers` (Node.js) par click karein.
   - Apko ek string milegi jaise: `mongodb+srv://user:<password>@cluster.xyz.mongodb.net/?retryWrites=true&w=majority`

---

## Step 2: Environment Variables Set Karein

`neocart/server/.env` file ko open karein aur ye details update karein:

```env
PORT=5000
MONGO_URI=apka_connection_string_yahan_daalein
JWT_SECRET=supersecretkey123
```
> [!IMPORTANT]
> Connection string mein `<password>` ki jagah apna asli Atlas password dalein!

---

## Step 3: Database mein Data Seed Karein (Auto-populate)

Maine server folder mein ek `seeder.js` script banayi hai jo futuristic products ko auto-insert kar degi.

1. Naya terminal open karein.
2. Server directory mein jayein:
   ```bash
   cd neocart/server
   ```
3. Ye command run karein:
   ```bash
   npm run seed
   ```
*Isse aapka database check karega, purane dummy products delete karega aur naye 6-8 futuristic products (VR headsets, Smartwatches) insert kar dega.*

---

## Step 4: MongoDB Compass Se Verification

Agar aap database dekhna chahte hain:
1. [MongoDB Compass](https://www.mongodb.com/try/download/compass) download karein.
2. Apni **Connection String** paste karke login karein.
3. `neocart` database ke andar `products` collection check karein.

---

## Step 5: Deployment Suggestions

- **Frontend:** Vercel ya Netlify.
- **Backend:** Render ya Railway.
- **Database:** MongoDB Atlas (Jo humne set kiya).

Ye sab ho jaye toh batana, phir hum build ready karke push karenge!
