<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Class ApiController
 *
 * @package App\Http\Controllers\Api
 */
class ApiController extends Controller
{
    /** @var array */
    protected array $data = [];

    /** @var array */
    protected array $errorMessages = [];

    /** @var bool */
    protected bool $isError = false;

    /**
     * @param $data
     *
     * @return JsonResponse
     */
    protected function successResponse($data): JsonResponse
    {
        $this->data = $data;

        return $this->buildResponse(Response::HTTP_OK);
    }

    /**
     * @param $code
     *
     * @return JsonResponse
     */
    protected function buildResponse($code): JsonResponse
    {
        $response = [
            'data' => $this->data,
            'isError' => $this->isError,
            'errorMessages' => $this->errorMessages,
        ];

        return response()->json($response, $code);
    }

    /**
     * @param  array  $messages
     *
     * @return JsonResponse
     */
    protected function userErrorResponse(array $messages): JsonResponse
    {
        $this->isError = true;
        $this->errorMessages = $messages;

        return $this->buildResponse(Response::HTTP_BAD_REQUEST);
    }

    /**
     * @return JsonResponse
     */
    protected function notFoundResponse($messages): JsonResponse
    {
        $this->isError = true;
        $this->errorMessages = $messages;
        return $this->buildResponse(Response::HTTP_NOT_FOUND);
    }
    /**
     * @return JsonResponse
     */
    public function unauthorizedResponse(array $messages) 
    {
        $this->isError = true;
        $this->errorMessages = $messages;
        return $this->buildResponse(Response::HTTP_UNAUTHORIZED);
    }

    /**
     * @return JsonResponse
     */
    protected function forbiddenResponse(): JsonResponse
    {
        return $this->buildResponse(Response::HTTP_FORBIDDEN);
    }

    /**
     * @param  array  $messages
     *
     * @return JsonResponse
     */
    protected function applicationErrorResponse(array $messages): JsonResponse
    {
        $this->isError = true;
        $this->errorMessages = $messages;

        return $this->buildResponse(Response::HTTP_INTERNAL_SERVER_ERROR);
    }


    public function readingFromJsonFile() {

        $path = realpath('../../backend/database/json/results.json');
        $result = json_decode(file_get_contents($path), true);

        function printArray($array){
            $newArray = [];
            foreach($array as $key => $value){
                if(is_array($value)){
                    $newArray[$key] = $value;
                    printArray($value);
                }else {
                    $newArray[$key] = $value;
                }
            }
            return $newArray;
        }

    $result = printArray($result);
    dd($result);
}
}