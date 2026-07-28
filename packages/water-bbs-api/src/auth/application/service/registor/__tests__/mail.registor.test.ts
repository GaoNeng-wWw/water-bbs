// /* eslint-disable @typescript-eslint/unbound-method */
// import { EntityManager } from '@mikro-orm/core';
// import { MailRegistor } from '../mail.registor';
// import { TestBed } from '@suites/unit';
// import { type Mocked } from '@suites/doubles.vitest';
// import { EventBus } from '@nestjs/cqrs';
// import { Credential, Identifier } from '../../../../entites';
// import { MailRegisteredEvent } from '../../../../domain';

// describe(MailRegistor.name, () => {
//   let mailRegistor: MailRegistor;
//   let em: Mocked<EntityManager>;
//   let eb: Mocked<EventBus>;
//   beforeEach(async () => {
//     const { unit, unitRef } = await TestBed.solitary(MailRegistor).compile();
//     mailRegistor = unit;
//     em = unitRef.get(EntityManager) as any;
//     eb = unitRef.get(EventBus) as any;
//   });
//   it('Validate fail', async () => {
//     const identType = ['phone', '%email', 'email%'];
//     await Promise.all(
//       identType.map((t) =>
//         expect(mailRegistor.validate(t)).resolves.toBe(false),
//       ),
//     );
//   });
//   it('Validate Success', async () => {
//     const identType = [
//       'email',
//       ' email',
//       'email ',
//       ' email ',
//       '  email',
//       'email  ',
//       '  email  ',
//       ' Email',
//       'Email ',
//       ' EMAIL',
//       'EMAIL ',
//     ];
//     await Promise.all(
//       identType.map((t) =>
//         expect(mailRegistor.validate(t)).resolves.toBe(true),
//       ),
//     );
//   });
//   describe('execute', () => {
//     it('should create identifier and credential, persist, flush, publish event and return ok', async () => {
//       const mockIdent = { id: 1 } as unknown as Identifier;
//       const mockCert = { id: 1 } as unknown as Credential;

//       em.create.mockReturnValueOnce(mockIdent).mockReturnValueOnce(mockCert);
//       em.persist.mockReturnValue(em);
//       em.flush.mockResolvedValue(undefined);

//       const props = {
//         identType: 'email',
//         identValue: 'test@example.com',
//         certType: 'password',
//         certValue: 'hashed_password',
//       };

//       const result = await mailRegistor.execute(props);

//       expect(em.create).nthCalledWith(1, Identifier, {
//         identType: 'email',
//         identValue: 'test@example.com',
//         verified: false,
//       });
//       expect(em.create).nthCalledWith(2, Credential, {
//         certType: 'password',
//         certValue: 'hashed_password',
//         identifier: mockIdent,
//       });
//       expect(em.persist).nthCalledWith(1, mockIdent);
//       expect(em.persist).nthCalledWith(2, mockCert);
//       expect(em.flush).toHaveBeenCalledOnce();

//       await new Promise(setImmediate);
//       expect(eb.publish).toHaveBeenCalledWith(
//         new MailRegisteredEvent('test@example.com'),
//       );

//       expect(result.isOk()).toBe(true);
//       expect(result._unsafeUnwrap()).toBe(mockIdent);
//     });
//   });
// });
