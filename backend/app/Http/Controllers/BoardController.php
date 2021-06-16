<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class BoardController extends ApiController
{
    public function displayBoards(Request $request) {
        $users = User::all();
        $boards = Board::with('user')->get();

        return $this->successResponse(['boards',$boards,'users',$users]);
    }
    public function viewBoard ($id){
        $board = Board::with('user')->where('id',$id)->first();

        if(!$board){
            return $this->notFoundResponse(['error' => 'Board was not found']);
        }
        return $this->successResponse(['board',$board]);
    }
    
    public function addBoard(Request $request){
        $user = Auth::guard('api')->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'id' => 'required',
            
        ]);

        if ($validator->fails()) {
            return $this->userErrorResponse($validator->getMessageBag()->toArray());
        }
        if(!$user){
            return $this->unauthorizedResponse(['error' => 'Unauthorized access']);
        }
        $board = new Board();

        $board->name = $request->get('name');
        $board->user_id = $request->get('id');

        $board->save();
        return $this->successResponse(['board' => $board]);

    }

    public function update(Request $request,$id) {

        $board = Board::where('id',$id)->first();
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'id' => 'required'
        ]);

        if ($validator->fails()) {
            return $this->userErrorResponse($validator->getMessageBag()->toArray());
        }

        if($board){
            $board->name = $request->name;
            $board->user_id = $request->id;
            $board->save();
        }
 
        return $this->successResponse(['board' => $board]);

    }
    public function destroy($id) {
       $boardToDelete = Board::find($id);
       $boardToDelete->delete();
       
       $boards = Board::with('user')->get();
       return $this->successResponse(['boards' => $boards]);
    }

}
