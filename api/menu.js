const menuData = [
  {
    "_id": "efebd530-c409-4bf4-9589-3afd36ecc566",
    "name": "Biriyani Rice", "subtitle": "Quick Lunch", "price": 40,
    "img": "https://lh3.googleusercontent.com/aida-public/AB6AXuDgwfzPa6EXTPXHqAo4nBbhGwtXu7cae6kuh-ZLIKSek6fHRI-Q59XA9u6sHVx9H1kI6SFpGvp1UET2PYYTVgl1_dgr4ADxtZotTUR9erLiGnKgbghgu4K1jdxu8Ncr8ECRfRMVCHg2LaQx9_xSJl6tRfr0vy83woQ3EdYKWYm4OhFzJPHb2eS1tCE9VH_9LCgB-l5NrlxlqH41xMEZGH9Lxwasp2O8IvxIPpv3VVKdftl6kjgOVGw2sGfmt6Q_d2F7mMPXZ3RrHHDq",
    "category": "Meals", "available": true
  },
  {
    "_id": "eb83002b-74ad-4748-a12f-8b44b40c0ff9",
    "name": "Samosa", "subtitle": "Snacks", "price": 8,
    "img": "https://lh3.googleusercontent.com/aida-public/AB6AXuD18JXUxrW41B1yS_re-eshR0oN79VeboJ37e8Bukq-BxkrdUVkPL7SnDdyWaz0U71H8xQWG_lSWD98uNu4N68d5ZXT_L2Lmt9T_a2eoc-L3zka-qUFnWy1gBrCiTbfUtNrN3dUpXtlN2MpI3fyjsUgDLJD0GbSEtDwYUSdq0P8Vp2ar4aleIsKSkpZgWKindp_6Vv2_8mxT_WsJd7i_zZTmOnmeWWR5w4Jrjrydu-7tzkUbMS309Bef5k09uKsWP3TBFSef8UZOFwJ",
    "category": "Snacks", "available": true
  },
  {
    "_id": "4920e1a5-ebbd-4df4-abe5-74dd2a59604f",
    "name": "Tea", "subtitle": "Hot Drinks", "price": 8,
    "img": "https://lh3.googleusercontent.com/aida-public/AB6AXuBGpTP4jU4LusK7Megj_c2h8rq-idHdRe4leY552SSNVyQIOLQt2npzhghHy7lSowb9DbtZTZ1bIB7VPPpuicHoryLnQJtWBogLrvb5B9sTX3VqDxcYuCrblCrp1LkzyGG--uiOKzu19ahlSS_RUaQS6LeiAps07K7vl2SuFZFw5i5EQEdPmI0uX-ELeR1AqqlR-Q41G-E4gAcNO0yW6eOUVSrFHaO0r5uj4Nz9KbHwetLSMcCjzcH4Pkkh5bLnZFUgwyDhbYRV9k0H",
    "category": "Drinks", "available": true
  },
  {
    "_id": "3b1eaef0-3d99-4ed5-838d-cb2b553e2c66",
    "name": "Coffee", "subtitle": "Hot Drinks", "price": 12,
    "img": "https://lh3.googleusercontent.com/aida-public/AB6AXuDLax5wZswl35-3xLz7rRymHazyjU6ClKDdHncaTqQzu4Jcj3FDQFSizN1S2t5KlJ4q1GaIxTVzEbZKduQCz4ktTjoTe-CqKA2QpR-iK1s_GE3uzCUOmRTDp1JrEyCDLv4w0Dns9qO8bMICy_c9m57gto051dWSpbF4PENp3_BRGdbOe3aw242Jr-28AEUGSGrWwrh5KYcg_k4_vQYVVjOkneHYramnxHz9RhA1PlJGfta9lOSX1sYGMutlyycoCVrEGUUDm4STLEvR",
    "category": "Drinks", "available": true
  },
  {
    "_id": "m1-meals", "name": "Meals", "subtitle": "Full Lunch", "price": 30,
    "img": "https://lh3.googleusercontent.com/aida-public/AB6AXuCGjmyqrhHFHzoLGgy-96Jgczo8y6jq6HEijIVLLizX4hqCjfdjVO2oiHdr4ZE35KX81AEvARkkRmw--Uy128uOTF8fEcpMVvNDXpDsP1y-Xs3wQivXnG0i9FxDtq76D-zfGGJSxzuOpRVPdQXyzAVT57dJ8IkNUdTNPHPfKKCVbTy664FkibqXAy3Ya0nbaNnYkJqmtYr1jzreiOqJkKcmei9gVDIy8zu30hjCIQcpZ16Jqq8rWw1tY71FXpdlQIzal4P8Ju7RrXx8",
    "category": "Meals", "available": true
  },
  {
    "_id": "m2-biriyani", "name": "Biriyani", "subtitle": "Premium", "price": 65,
    "img": "https://lh3.googleusercontent.com/aida-public/AB6AXuDeiKXM42ICpsDb1DNhPLUFXtuGTW7ZSUGmWKM4j-RQNvQ9R5t3BsY0BU2bEdHLxc7vfYTUO1ON1ednjN-tXrOCHFNUVWyyYlZztMxr5EWkaRoWx6tFCP5uMt1VzhnuG9f9PsYf3rSMMYtB8g-nTDeUfiuRox7vVkGFvYhtQlHcYTzOL2kvH4YL6oXm-T7yNxqh7HZ3O3MrQaDcg89jHnqla_5oFe7EaDLLFgo-JlY9HHVv6QRqqjCNGAKxLDBPMZuyDE_6zftnJ9AX",
    "category": "Meals", "available": true
  }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.json(menuData);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
