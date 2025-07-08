<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\RegisterUserRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\LoginUserRequest;

class AuthController extends Controller
{
    public function register(RegisterUserRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = Auth::login($user);

        return response()->json([
            'message' => 'User registered successfully',
            'data' => [
                'user' => $user->only('id', 'name', 'email'),
                'authorization' => [
                    'token' => $token,
                    'type' => 'bearer',
                ],
            ],
        ]);
    }

    public function login(LoginUserRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');
        $token = Auth::attempt($credentials);

        if (!$token) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        $user = Auth::user();

        return response()->json([
            'message' => 'Login successful',
            'data' => [
                'user' => $user->only('id', 'name', 'email'),
                'authorization' => [
                    'token' => $token,
                    'type' => 'bearer',
                ],
            ],
        ]);
    }

    public function logout(): JsonResponse
    {
        Auth::logout();
        return response()->json([
            'message' => 'Successfully logged out',
        ]);
    }

    public function refresh(): JsonResponse
    {
        return response()->json([
            'message' => 'Token refreshed',
            'data' => [
                'user' => Auth::user()->only('id', 'name', 'email'),
                'authorization' => [
                    'token' => Auth::refresh(),
                    'type' => 'bearer',
                ],
            ],
        ]);
    }
}
