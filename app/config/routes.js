import userRoutes from "../routes/userRoutes";

const router = express.Router();

router.use('/user', userRoutes);
router.use('/chat', chatRoutes);

export default router;