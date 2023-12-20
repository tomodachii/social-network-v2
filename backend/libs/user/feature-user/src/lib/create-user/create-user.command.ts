import { Command, CommandProps } from '@lib/shared/ddd-v2';
import { Gender } from '@lib/user/domain';
export class CreateUserCommand extends Command {
  readonly email: string;
  readonly phoneNumber: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly birthDay: Date;
  readonly gender: Gender;

  constructor(props: CommandProps<CreateUserCommand>) {
    super(props);
    this.email = props.email;
    this.phoneNumber = props.phoneNumber;
    this.password = props.password;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.birthDay = props.birthDay;
    this.gender = props.gender;
  }
}
