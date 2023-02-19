export default {
  jwt: {
    secret: process.env.JWT_SECRET as string || "jwt secret",
    expiresIn: '1d'
  }
}
