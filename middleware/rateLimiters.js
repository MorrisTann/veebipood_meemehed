const rateLimit = require('express-rate-limit');

// Parooli taastamise piirang
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutit
  max: 5,
  keyGenerator: (req) => req.body.email, // Piiramine e-posti alusel
  message: {
    error: 'Liiga palju parooli taastamise taotlusi. Palun proovi uuesti 15 minuti pärast.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Registreerimise piirang
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutit
  max: 5,
  keyGenerator: (req) => req.body.email, // Piiramine e-posti alusel
  message: {
    error: 'Liiga palju registreerimiskatseid. Palun proovi uuesti 15 minuti pärast.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Sisselogimise piirang
const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutit
    max: 10,
    message: {
      error: "Liiga palju sisselogimiskatseid. Palun proovi uuesti 5 minuti pärast.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Jäta keyGenerator välja → vaikimisi kasutatakse IP-aadressi
  });  

module.exports = {
  forgotPasswordLimiter,
  registerLimiter,
  loginLimiter,
};
