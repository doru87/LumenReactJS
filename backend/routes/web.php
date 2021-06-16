<?php

/** @var \Laravel\Lumen\Routing\Router $router */

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\ApiController;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->group(['prefix' => 'api'], function () use ($router) {
    $router->post('/login', 'AuthController@login');
    $router->get('/reading','ApiController@readingFromJsonFile');

    $router->group(['middleware' => 'auth'], function () use ($router) {
        $router->post('/logout','AuthController@logout');
        $router->get('/boards','BoardController@displayBoards');
        $router->get('/board/{id}', 'BoardController@viewBoard');
        $router->put('/board/add', 'BoardController@addBoard');
        $router->patch('/board/update/{id}', 'BoardController@update');
        $router->delete('/board/delete/{id}','BoardController@destroy');
    });
});