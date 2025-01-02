import { Request, Response } from 'express';

export const Logout = (req: Request, res: Response) => {
    try {
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        return res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        console.error('Error in logout route:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

