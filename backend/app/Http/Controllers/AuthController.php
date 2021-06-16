<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends ApiController
{

    public function login(Request $request)
    {
        $email = $request->email;
        $password = $request->password;

        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'password' => 'required',
        ], [
            'email.required' => 'Email is required',
            'email.email' => 'Email is invalid',
            'email.exists' => 'Email is not registered',
        ]);

        if ($validator->fails()) {
            return $this->userErrorResponse($validator->getMessageBag()->toArray());
        }

        if (! $token = Auth::attempt(['email' => $email,'password' => $password])) {
            return $this->unauthorizedResponse(['error' => 'Unauthorized access']);
        }
        return $this->respondWithToken($token);
    }

    /**
     * Get the token array structure.
     *
     * @param string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }

    public function logout() {
        Auth::guard('api')->logout();
        return response()->json([
            'status' => 'success',
            'message' => 'You have been logged out!'
        ], 200);
    }
}
