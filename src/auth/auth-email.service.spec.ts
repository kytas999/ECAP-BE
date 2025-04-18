// import { DataSource } from 'typeorm';

// import { ConfigModule } from '@nestjs/config';
// import { JwtModule, JwtService } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { Test, TestingModule } from '@nestjs/testing';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { MailerService } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

// import { mockConfigService } from '../test-utils/config-service.mock';
// import dbTestingUtils from '../test-utils/db-testing.utils';
// import { RoleEntity } from '../users/entities/role.entity';
// import { UserEntity } from '../users/entities/user.entity';
// import { UserRoleEntity } from '../users/entities/user-role.entity';
// import { UsersService } from '../users/users.service';

// import usersFixtures from './fixtures/users.fixtures';
// import { AuthEmailService } from './auth-email.service';

// describe('AuthEmailService', () => {
//   let service: AuthEmailService;
//   let userService: UsersService;
//   let emailService: MailerService;
//   let module: TestingModule;
//   let dataSource: DataSource;
//   let jwtService: JwtService;

//   beforeAll(async () => {
//     jest.clearAllMocks();

//     module = await Test.createTestingModule({
//       imports: [
//         ...dbTestingUtils.TypeOrmTestingModule([
//           UserEntity,
//           RoleEntity,
//           UserRoleEntity,
//         ]),
//         JwtModule.register({}),
//         PassportModule,
//         ConfigModule,
//         MailerModule.forRoot({
//           transport: {
//             host: process.env.MAIL_HOST,
//             port: 587,
//             secure: false,
//             auth: {
//               user: process.env.MAIL_USER,
//               pass: process.env.MAIL_PASSWORD,
//             },
//           },
//           defaults: {
//             from: `"No Reply" <${process.env.MAIL_HOST}>`,
//           },
//           template: {
//             dir: 'templates-fake-path',
//             adapter: new HandlebarsAdapter(),
//             options: {
//               strict: true,
//             },
//           },
//         }),
//       ],
//       providers: [
//         AuthEmailService,
//         mockConfigService(envFixtures),
//         UsersService,
//       ],
//     }).compile();

//     service = module.get<AuthEmailService>(AuthEmailService);
//     userService = module.get<UsersService>(UsersService);
//     emailService = module.get<MailerService>(MailerService);
//     dataSource = module.get<DataSource>(DataSource);
//     jwtService = module.get<JwtService>(JwtService);
//   });

//   afterAll(() => {
//     module.close();
//   });

//   beforeEach(async () => {
//     jest.clearAllMocks();

//     await dbTestingUtils.loadFixtures(dataSource, usersFixtures);
//   });

//   afterEach(async () => {
//     await dbTestingUtils.clearFixtures(dataSource);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('When send a confirmationLink', () => {
//     it('should send an email confirmation link', async () => {
//       jest.spyOn(emailService, 'sendMail').mockImplementation(jest.fn());

//       await service.sendVerificationLink('some@mail.com', 'username1');

//       expect(emailService.sendMail).toHaveBeenCalledWith({
//         to: 'some@mail.com',
//         subject: 'Welcome to the application. To confirm the email address',
//         template: './confirmation',
//         context: {
//           username: 'username1',
//           link: expect.stringContaining('/auth/confirm-email?token=eyJhb'),
//         },
//       });
//     });

//     it('should send an email confirmation link without username', async () => {
//       jest.spyOn(emailService, 'sendMail').mockImplementation(jest.fn());

//       await service.sendVerificationLink('some@mail.com');

//       expect(emailService.sendMail).toHaveBeenCalledWith({
//         to: 'some@mail.com',
//         subject: 'Welcome to the application. To confirm the email address',
//         template: './confirmation',
//         context: {
//           username: 'some@mail.com',
//           link: expect.stringContaining('/auth/confirm-email?token=eyJhb'),
//         },
//       });
//     });
//   });

//   describe('When send a confirmationLink for new email', () => {
//     it('should send an email confirmation link', async () => {
//       jest.spyOn(emailService, 'sendMail').mockImplementation(jest.fn());

//       await service.sendNewEmailVerificationLink(
//         {
//           email: 'some@mail.com',
//           newEmail: 'new-some@mail.com',
//         },
//         'username1',
//       );

//       expect(emailService.sendMail).toHaveBeenCalledWith({
//         to: 'new-some@mail.com',
//         subject: 'Confirm your new email address',
//         template: './confirmation',
//         context: {
//           username: 'username1',
//           link: expect.stringContaining(
//             '/auth/email/confirm-new-email?token=eyJhb',
//           ),
//         },
//       });
//     });

//     it('should send an email confirmation link without username', async () => {
//       jest.spyOn(emailService, 'sendMail').mockImplementation(jest.fn());

//       await service.sendNewEmailVerificationLink({
//         email: 'some@mail.com',
//         newEmail: 'new-some@mail.com',
//       });

//       expect(emailService.sendMail).toHaveBeenCalledWith({
//         to: 'new-some@mail.com',
//         subject: 'Confirm your new email address',
//         template: './confirmation',
//         context: {
//           username: 'new-some@mail.com',
//           link: expect.stringContaining(
//             '/auth/email/confirm-new-email?token=eyJhb',
//           ),
//         },
//       });
//     });
//   });

//   describe('When validate confirm email token', () => {
//     describe('When token has a valid payload', () => {
//       beforeEach(() => {
//         jest
//           .spyOn(jwtService, 'verify')
//           .mockReturnValue({ email: 'smith@mail.com' });
//       });

//       it('should return the email', () => {
//         const email = service.validateConfirmEmailToken('some-token');

//         expect(email).toEqual('smith@mail.com');
//       });
//     });

//     describe('When token has an invalid payloadd', () => {
//       beforeEach(() => {
//         jest.spyOn(jwtService, 'verify').mockReturnValue({});
//       });

//       it('should throw an error', () => {
//         expect(() => service.validateConfirmEmailToken('some-token')).toThrow(
//           'Invalid token payload',
//         );
//       });
//     });
//   });

//   describe('When verify an email token', () => {
//     describe('When user is active', () => {
//       beforeEach(() => {
//         jest
//           .spyOn(jwtService, 'verify')
//           .mockReturnValue({ email: 'smith@mail.com' });
//       });

//       it('should return the updated user', async () => {
//         const user = await service.verifyEmailToken('some-token');

//         expect(user).toStrictEqual(
//           expect.objectContaining({
//             id: 1,
//             emailVerified: true,
//             email: 'smith@mail.com',
//           }),
//         );
//       });
//     });

//     describe('When user is inactive', () => {
//       beforeEach(() => {
//         jest
//           .spyOn(jwtService, 'verify')
//           .mockReturnValue({ email: 'jay@mail.com' });
//       });
//       it('should throw an error', () => {
//         expect(service.verifyEmailToken('jay@mail.com')).rejects.toThrow(
//           'User is not active',
//         );
//       });
//     });
//   });

//   describe('When resend a verification email', () => {
//     describe('When email is not verified', () => {
//       beforeEach(() => {
//         jest.spyOn(emailService, 'sendMail').mockImplementation(jest.fn());
//       });

//       it('should resend the email', async () => {
//         const pendingEmail = 'rebecca@mail.com';
//         await service.resendConfirmationLink(pendingEmail);

//         expect(emailService.sendMail).toHaveBeenCalledWith({
//           to: 'rebecca@mail.com',
//           subject: 'Welcome to the application. To confirm the email address',
//           template: './confirmation',
//           context: {
//             username: 'rebecca@mail.com',
//             link: expect.stringContaining('/auth/confirm-email?token=eyJhb'),
//           },
//         });
//       });
//     });
//     describe('When email is verified', () => {
//       it('should resend the email', () => {
//         const pendingEmail = 'reby@mail.com';

//         expect(service.resendConfirmationLink(pendingEmail)).rejects.toThrow(
//           'Email has been verified',
//         );
//       });
//     });
//   });

//   describe('When send a restore password link', () => {
//     it('should send an email confirmation link', async () => {
//       jest.spyOn(emailService, 'sendMail').mockImplementation(jest.fn());

//       await service.sendForgotPasswordLink('some@mail.com', 'username1');

//       expect(emailService.sendMail).toHaveBeenCalledWith({
//         to: 'some@mail.com',
//         subject: 'Reset your password',
//         template: './restore-password',
//         context: {
//           username: 'username1',
//           link: expect.stringContaining('/auth/restore-password?token=eyJhb'),
//         },
//       });
//     });
//   });

//   describe('When change user email', () => {
//     it('should update the user email', async () => {
//       const result = await service.changeEmail(1, 'new-email@mail.com');

//       expect(result).toBe(true);

//       const user = await userService.findUserById(1);

//       expect(user.email).toBe('new-email@mail.com');
//     });
//   });
// });
