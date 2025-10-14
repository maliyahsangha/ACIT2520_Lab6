import { Strategy as GitHubStrategy, Profile } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { userModel } from '../../models/userModel';
import { Request } from "express";

const githubStrategy: GitHubStrategy = new GitHubStrategy(
    {
        clientID: "",
        clientSecret: "",
        callbackURL: "",
        passReqToCallback: true,
    },
    
    /* FIX ME 😭 */
    async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: (err: any, user?: Express.User | false | null) => void) => {
        try {
            let user;

            try {
            if (!profile.emails?.[0].value) { // check is the profile has an email
                return done(new Error("ERROR"), null); // returns error if there is no email
            }

            // look for the user by email
            user = await userModel.findOne(undefined, profile.emails?.[0].value);
            
            done(null, user); // pass to Passport

            } catch (err) {
                console.log(err);
                done(err, null); // sends to Passport
            }

            } catch (err) {
                console.log(err);
                done(err, null);
            }
        },
);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

export default passportGitHubStrategy;
