import user from '../models';

const { User } = user;

const successfulSignup = {
  email: 'marc@gmail.com',
  username: 'marcus',
  password: 'marcpass123'
};

const successfulSignup1 = {
  email: 'juwon@gmail.com',
  username: 'juwon',
  password: 'marcjjuwon123'
};

const successfulSignup2 = {
  email: 'andela@gmail.com',
  username: 'frosty',
  password: 'sagajones'
};

const loginData = {
  email: 'marc@gmail.com',
  password: 'marcpass123'
};

const successfulLogin2 = {
  email: 'andela@gmail.com',
  password: 'sagajones'
};

const nonExistingEmail = {
  email: 'marc50@gmail.com',
  password: 'marcpass123'
};

const incorrectPassword = {
  email: 'marc@gmail.com',
  password: 'marcpass12'
};

const completeProfileData = {
  username: 'jayboy',
  email: 'marcjay@gmail.com',
  password: 'marcpass123',
  bio: 'This is a short bio',
  image: 'http://google.com.ng'
};

const undefinedPassword = {
  username: 'jayboy',
  email: 'marcjay@gmail.com',
  bio: 'This is a short bio',
  image: 'http://google.com.ng'
};

const updateProfile = {
  username: 'jayboy',
  email: 'jaybaba@gmail.com',
  bio: 'This is a long bio',
  image: 'http://www.googleeee.com.jpg'
};

const undefinedEmail = {
  username: 'jayboy',
  bio: 'This is a long bio',
  image: 'http://www.googleeee.com.jpg'
};

const undefinedBio = {
  username: 'jayboy',
  email: 'jaybaba@gmail.com',
  image: 'http://www.googleeee.com.jpg'
};

const undefinedImage = {
  username: 'jayboy',
  email: 'jaybaba@gmail.com',
  bio: 'This is a long bio'
};

const undefinedUsername = {
  email: 'jaybaba@gmail.com',
  bio: 'This is a long bio',
  image: 'http://www.googleeee.com.jpg'
};

const noEmailUpdate = {
  username: 'jayboy',
  email: ' ',
  bio: 'This is a long bio',
  image: 'http://www.googleeee.com.jpg'
};
const noUsernameUpdate = {
  username: '',
  email: 'jaybaba@gmail.com',
  bio: 'This is a long bio',
  image: 'http://www.googleeee.com.jpg'
};

const noImageUpdate = {
  username: 'jayboy',
  email: 'jaybaba@gmail.com',
  bio: 'This is a long bio',
  image: ''
};

const noBioUpdate = {
  username: 'jayboy',
  email: 'jaybaba@gmail.com',
  bio: '',
  image: 'http://www.googleeee.com.jpg'
};

const longBioUpdate = {
  username: 'jayboy',
  email: 'jaybaba@gmail.com',
  bio: `vrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrni
  urngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngir
  vrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngir
  vrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngir
  vrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngir
  vrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngir
  vrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngir
  vrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngir`,
  image: 'http://www.googleeee.com.jpg'
};

const lengthyUsername = `vrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrni
urngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngir
vrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngir
vrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngir
vrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngir
vrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngir
vrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngir
vrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngirvrgtrgnngrniurngrngir`;

const longUsernameUpdate = {
  username: `${lengthyUsername}`,
  email: 'jaybaba@gmail.com',
  bio: 'This is a long bio',
  image: 'http://www.googleeee.com.jpg'
};

const invalidImageUrl = {
  username: 'jayboy',
  email: 'jaybaba@gmail.com',
  bio: 'This is a long bio',
  image: 'http://www.googleeee.com'
};

const emptyUsername = undefined;

const fakeUsername = 'abcdguyman';

const addSeedUser = async (seedUser) => {
  await User.create(seedUser);
};

const removeSeedUsers = async () => {
  await User.truncate();
};

const fakeToken = 'nvejvkneje.jhrnejne.nvuenfvemivmnemerfne';
const incompleteToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoxLCJ1c2VybmFtZSI6Imp1d2l6eTI0Nzg5In0sImlhdCI6MTU0Mzc3NzgyOCwiZXhwIjoxNTQzODY0MjI4fQ.VWp2lkDvHZjFsDW7X0_OQhjKIDounpMDYyM_gwvJaR';

export {
  successfulSignup1,
  successfulSignup2,
  successfulLogin2,
  nonExistingEmail,
  incorrectPassword,
  completeProfileData,
  updateProfile,
  successfulSignup,
  loginData,
  addSeedUser,
  removeSeedUsers,
  fakeToken,
  incompleteToken,
  fakeUsername,
  lengthyUsername,
  emptyUsername,
  noEmailUpdate,
  noUsernameUpdate,
  longBioUpdate,
  longUsernameUpdate,
  undefinedEmail,
  undefinedBio,
  undefinedImage,
  undefinedUsername,
  invalidImageUrl,
  noImageUpdate,
  noBioUpdate,
  undefinedPassword
};
