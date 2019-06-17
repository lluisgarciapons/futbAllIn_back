const graphql = require("graphql");
const moment = require("moment");
// const _ = require("lodash");
const Book = require("../model/book");
const Author = require("../model/author");
// const Player = require("../model/player");
const Team = require("../model/team");
const Match = require("../model/match");
const User = require("../model/user");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // return _.filter(books, { authorId: parent.id });
        return Book.find({ authorId: parent.id });
      }
    }
  })
});

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        // return _.find(authors, { id: parent.authorId });
        return Author.findById(parent.authorId);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    googleId: { type: GraphQLString },
    token: { type: GraphQLString },
    name: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    photoURL: { type: GraphQLString },
    avatar: { type: GraphQLString },
    team: {
      type: TeamType,
      resolve(parent, args) {
        return Team.findById(parent.teamId);
      }
    }
  })
});

// const PlayerType = new GraphQLObjectType({
//   name: "Player",
//   fields: () => ({
//     id: { type: GraphQLID },
//     username: { type: GraphQLString },
//     avatar: { type: GraphQLString },
//     team: {
//       type: TeamType,
//       resolve(parent, args) {
//         return Team.findById(parent.teamId);
//       }
//     },
//     user: {
//       type: UserType,
//       resolve(parent, args) {
//         return User.findById(parent.userId);
//       }
//     }
//   })
// });

const TeamType = new GraphQLObjectType({
  name: "Team",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    short_name: { type: GraphQLString },
    avatar: { type: GraphQLString },
    public: { type: GraphQLBoolean },
    players: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({ teamId: parent.id });
      }
    },
    matches: {
      type: new GraphQLList(MatchType),
      resolve(parent, args) {
        return Match.find({
          $or: [{ teamId1: parent.id }, { teamId2: parent.id }]
        });
      }
    }
  })
});

const MatchType = new GraphQLObjectType({
  name: "Match",
  fields: () => ({
    id: { type: GraphQLID },
    date: { type: GraphQLString },
    teams: {
      type: new GraphQLList(TeamType),
      resolve(parent, args) {
        // return _.filter(books, { authorId: parent.id });
        return Team.find({
          _id: {
            $in: [parent.teamId1, parent.teamId2]
          }
        });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //return _.find(books, { id: args.id });
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        //return _.find(authors, { id: args.id });
        return Author.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        //return books;
        return Book.find({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        //return authors;
        return Author.find({});
      }
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      }
    },
    users: {
      type: GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      }
    },
    // player: {
    //   type: PlayerType,
    //   args: { id: { type: GraphQLID } },
    //   resolve(parent, args) {
    //     return Player.findById(args.id);
    //   }
    // },
    // players: {
    //   type: new GraphQLList(PlayerType),
    //   resolve(parent, args) {
    //     return Player.find({});
    //   }
    // },
    team: {
      type: TeamType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Team.findById(args.id);
      }
    },
    teams: {
      type: new GraphQLList(TeamType),
      resolve(parent, args) {
        return Team.find({});
      }
    },
    match: {
      type: MatchType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Match.findById(args.id);
      }
    },
    matches: {
      type: new GraphQLList(MatchType),
      resolve(parent, args) {
        return Match.find({});
      }
    },
    dayMatches: {
      type: new GraphQLList(MatchType),
      args: { date: { type: GraphQLString } },
      resolve(parent, args) {
        let date = new Date(args.date);
        const start = moment(date).startOf("day");
        const end = moment(start).endOf("day");
        // Find any match between the start of the given date and the end.
        return Match.find({
          date: {
            $gte: start.toDate(),
            $lte: end.toDate()
          }
        });
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return book.save();
      }
    },
    // createPlayer: {
    //   type: PlayerType,
    //   args: {
    //     username: { type: new GraphQLNonNull(GraphQLString) },
    //     avatar: { type: GraphQLString },
    //     teamId: { type: GraphQLID },
    //     userId: { type: new GraphQLNonNull(GraphQLID) }
    //   },
    //   resolve(parent, args) {
    //     let player = new Player({
    //       username: args.username,
    //       avatar: args.avatar,
    //       teamId: args.teamId,
    //       userId: args.userId
    //     });
    //     return player.save();
    //   }
    // },
    createTeam: {
      type: TeamType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        short_name: { type: new GraphQLNonNull(GraphQLString) },
        avatar: { type: GraphQLString }
      },
      resolve(parent, args) {
        let team = new Team({
          name: args.name,
          short_name: args.short_name,
          avatar: args.avatar
        });
        return team.save();
      }
    },
    addTeamToPlayer: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        teamId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let player = User.findByIdAndUpdate(
          args.userId,
          {
            $set: { teamId: args.teamId }
          },
          { new: true }
        );
        return player;
      }
    },
    modifyInfo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        username: { type: GraphQLString },
        avatar: { type: GraphQLString }
      },
      resolve(parent, args) {
        let user = User.findByIdAndUpdate(
          args.userId,
          {
            $set: {
              username: args.username,
              avatar: args.avatar
            }
          },
          { new: true }
        );
        return user;
      }
    },
    createMatch: {
      type: MatchType,
      args: {
        date: { type: new GraphQLNonNull(GraphQLString) },
        teamId1: { type: new GraphQLNonNull(GraphQLID) },
        teamId2: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args) {
        let match = new Match({
          date: new Date(args.date).toISOString(),
          teamId1: args.teamId1,
          teamId2: args.teamId2
        });
        return match.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
