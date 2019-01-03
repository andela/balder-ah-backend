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

const completeProfileData2 = {
  username: 'juwonzy',
  email: 'juwonzy@gmail.com',
  password: 'marcpass123',
  bio: 'This is a short bio',
  image: 'http://google.com.ng.png'
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
  await User.truncate({ cascade: true });
};

const firstUserSignup = {
  email: 'emkay@gmail.com',
  username: 'emkay',
  password: 'emkay123'
};

const secondUserSignup = {
  email: 'ogidan@gmail.com',
  username: 'ogidan',
  password: 'ogidan123'
};

const thirdUserSignup = {
  email: 'ejola@gmail.com',
  username: 'ejola',
  password: 'ejola123'
};

const firstUserLogin = {
  email: 'emkay@gmail.com',
  password: 'emkay123'
};

const secondUserLogin = {
  email: 'ogidan@gmail.com',
  password: 'ogidan123'
};

const thirdUserLogin = {
  email: 'ejola@gmail.com',
  password: 'ejola123'
};

const fourthUserSignup = {
  email: 'okoro@gmail.com',
  username: 'okoro',
  password: 'okoro123'
};

const fourthUserLogin = {
  email: 'ejola@gmail.com',
  username: 'ejola',
  password: 'ejola123'
};

const fakeToken = 'nvejvkneje.jhrnejne.nvuenfvemivmnemerfne';
const incompleteToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoxLCJ1c2VybmFtZSI6Imp1d2l6eTI0Nzg5In0sImlhdCI6MTU0Mzc3NzgyOCwiZXhwIjoxNTQzODY0MjI4fQ.VWp2lkDvHZjFsDW7X0_OQhjKIDounpMDYyM_gwvJaR';
const resetPasswordSuccessful = {
  email: 'marc@gmail.com',
};
const resetPasswordWithWrongEmail = {
  email: 'okoro@gmail.com',
};
const updatePasswordSuccessfully = {
  password: 'wiseV2424',
  confirmNewPassword: 'wiseV2424'
};
const updateWithWrongPassword = {
  password: 'wise2424',
  confirmNewPassword: 'wise242@'
};
const emptyResetEmail = {
  email: '',
};
const successfulSignup3 = {
  email: 'okoros@gmail.com',
  username: 'okoro',
  password: 'okoro1233456'
};

const firstSearchUserSignup = {
  username: 'peter',
  email: 'peter@andela.com',
  password: 'peterpeter'
};
const secondSearchUserSignup = {
  username: 'odekwo',
  email: 'odekwo@andela.com',
  password: 'odekwopeter'
};
const firstBookmarkSignup = {
  email: 'bookmark@gmail.com',
  username: 'Namesake',
  password: 'namesake'
};

const secondBookmarkSignup = {
  email: 'book@gmail.com',
  username: 'Namesakeme',
  password: 'namesakeme'
};

export {
  successfulSignup1,
  successfulSignup2,
  successfulLogin2,
  nonExistingEmail,
  incorrectPassword,
  completeProfileData,
  completeProfileData2,
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
  undefinedPassword,
  resetPasswordSuccessful,
  resetPasswordWithWrongEmail,
  updatePasswordSuccessfully,
  updateWithWrongPassword,
  emptyResetEmail,
  firstUserSignup,
  firstUserLogin,
  secondUserSignup,
  secondUserLogin,
  thirdUserSignup,
  thirdUserLogin,
  fourthUserSignup,
  fourthUserLogin,
  successfulSignup3,
  firstSearchUserSignup,
  secondSearchUserSignup,
  firstBookmarkSignup,
  secondBookmarkSignup
};
