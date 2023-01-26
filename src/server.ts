import * as model from './model.js';
import express from 'express';
import cors from 'cors';
import * as config from './config.js';
import { IFrontendUser, INewBook } from './interfaces.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import * as tools from './tools.js';

declare module 'express-session' {
	export interface SessionData {
		user: { [key: string]: any };
	}
}

const app = express();
app.use(express.json());
app.use(cors({
	origin: config.FRONTEND_URL,
	methods: ['POST', 'GET', 'DELETE', 'PUT', 'OPTIONS', 'HEAD'],
	credentials: true
}));
app.use(cookieParser());
app.use(
	session({
		resave: true,
		saveUninitialized: true,
		secret: config.SESSION_SECRET,
		cookie: {
			httpOnly: true,
			sameSite: 'lax',
			secure: false
		}
	})
);

// PUBLIC ROUTES

app.get('/', (req: express.Request, res: express.Response) => {
	res.send(model.getApiInstructions());
});

app.get('/books', async (req, res) => {
	const books = await model.getBooks();
	res.status(200).json(books);
});

app.get('/book/:id', async (req, res) => {
	const _id = req.params.id;
	const book = await model.getBook(_id);
	res.status(200).json(book);
});

app.post('/login', async (req: express.Request, res: express.Response) => {
	const { username, password } = req.body;
	const user = await model.getUser(username, password);
	if (user !== null) {
		const isCorrect = await tools.passwordIsCorrect(password, user.hash);
		if (isCorrect) {
			const frontendUser = {
				_id: user._id,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				accessGroups: user.accessGroups
			}
			req.session.user = frontendUser as IFrontendUser;
			req.session.cookie.expires = new Date(Date.now() + config.SECONDS_TILL_SESSION_TIMEOUT * 1000);
			req.session.save();
			res.status(200).send(frontendUser);
		} else {
			res.status(401).send({});
		}
	} else {
		res.status(401).send({});
	}
});

app.get('/get-current-user', (req: express.Request, res: express.Response) => {
	if (req.session.user) {
		res.send(req.session.user);
	} else {
		res.send('anonymousUser');
	}
});

app.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			res.send('ERROR');
		} else {
			res.send('logged out');
		}
	});
});


// PROTECTED ROUTES

const authorizeUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (req.session.user === 'admin' as any) {
		next();
	} else {
		res.status(401).send({});
	}
}

app.post('/book', authorizeUser, async (req, res) => {
	const book: INewBook = req.body;
	const result = await model.addBook(book);
	res.status(200).send(result);
});

app.put('/book/:id', authorizeUser, async (req, res) => {
	const _id = req.params.id;
	const book: INewBook = req.body;
	const result = await model.replaceBook(_id, book);
	res.status(200).json({
		oldBook: result.oldBook,
		result: result.newBook
	});
});

app.delete('/book/:id', authorizeUser, async (req, res) => {
	const _id = req.params.id;
	const result = await model.deleteBook(_id);
	res.status(200).json(result);
});

app.listen(config.PORT, () => {
	console.log(`${config.APP_NAME} is listening on port http://localhost:${config.PORT}`);
});