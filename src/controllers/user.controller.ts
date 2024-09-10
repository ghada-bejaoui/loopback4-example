import {
  TokenService
} from '@loopback/authentication';
import {
  Credentials,
  MyUserService, TokenServiceBindings, User, UserRepository, UserServiceBindings
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema, Filter, FilterExcludingWhere, model, property, repository,
  Where
} from '@loopback/repository';
import {
  del,
} from '@loopback/rest';
import {get, getModelSchemaRef, param, patch, post, requestBody, response, SchemaObject} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';


@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 5,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(@inject(TokenServiceBindings.TOKEN_SERVICE)
              public jwtService: TokenService,
              @inject(UserServiceBindings.USER_SERVICE)
              public userService: MyUserService,
              @inject(SecurityBindings.USER, {optional: true})
              public user: UserProfile,
              @repository(UserRepository) protected userRepository: UserRepository) {}

  /**********************************************************************************************/

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
      @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {user, token};
  }

  /**********************************************************************************************/
  /*@authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: '',
        schema: {
          type: 'string',
        },
      },
    },
  })
  async whoAmI(
      @inject(SecurityBindings.USER)
          currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }
*/
  /**********************************************************************************/

  @post('/users/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(NewUserRequest, {
              title: 'NewUser',
            }),
          },
        },
      })
          newUserRequest: NewUserRequest,
  ): Promise<User> {
    const password = await hash(newUserRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
        _.omit(newUserRequest, 'password'),
    );

    await this.userRepository.userCredentials(savedUser.id).create({password});

    return savedUser;
  }


  /******************************************************** */

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true})
        },
      },
    },
  })
  async find(
      @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }


  /**************************************************************************** */


  @patch('/users')
  @response(200, {
    description: 'user PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {partial: true}),
          },
        },
      })
          user: User,
      @param.where(User) where?: Where<User>,
  ): Promise<Count> {

    const password = await hash(user.password, await genSalt());
   /* const savedUser = await this.userRepository.create(
        _.omit(user, 'password'),
    );*/

    await this.userRepository.userCredentials(user.id).create({password});
    return this.userRepository.updateAll(user, where);
  }
  /******************************************************** */
/*
  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Printer, {includeRelations: true}),
      },
    },
  })
  async findById(
      @param.path.string('id') id: string,
      @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

*/



  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })

  async findById(@param.path.string('id') userId: string): Promise<User> {
    return this.userRepository.findById(userId);
  }
  /******************************************************** */
  @patch('/users/{id}')
  @response(200, {
    description: 'user PATCH success',
  })
  async updateById(
      @param.path.string('id') id: string,
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {partial: true}),
          },
        },
      })
          user: User,
  ): Promise<void> {
   // const password = await hash(user.password, await genSalt());
    /*const savedUser = await this.userRepository.create(
       _.omit(user, 'password'),
   );
 await this.userRepository.userCredentials(user.id).create({password});*/

    //Hash the plain password

    var context = this

    //await this.userRepository.deleteById(id)

    //context.userRepository.updateById(id, user);
    // @ts-ignore



    console.log("updateeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    console.log("user mobile ==>", user)
    await this.userRepository.deleteById(id)
    let savedUser = await this.userRepository.create(
        _.omit(user, 'password'),
    );
    console.log("savedUser => ", savedUser)

    if (user.password && user.password != ""){
      console.log("user.password ok  => ", user.password)

      const password = await hash(user.password, await genSalt());
      console.log("password   => ", password)

      await this.userRepository.userCredentials(savedUser.id).delete();
      await this.userRepository.userCredentials(savedUser.id).create({password});
    }

  }




  @get('/users/{username}')
  @response(200, {
    description: 'user model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findByusername(
      @param.path.string('username') username: string,
      @param.path.string('username') representant: string,
      @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User[]> {
    return this.userRepository.find({
      where:
          {username: {"regexp": "^username"}}
    });
  }
  /******************************************************** */
  /** COUNT*/
  @get('/users/count')
  @response(200, {
    description: '',
    content: {'application/json': {schema: CountSchema}},
  })

  async count(
      @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }
  /******************************************************** */
  @del('/users/{id}')
  @response(200, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }

}
