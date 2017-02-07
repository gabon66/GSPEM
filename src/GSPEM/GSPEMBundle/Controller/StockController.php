<?php

namespace GSPEM\GSPEMBundle\Controller;

use GSPEM\GSPEMBundle\Entity\StockSitio;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use GSPEM\GSPEMBundle\Entity\StockMaestro;
use GSPEM\GSPEMBundle\Entity\MovStockTec;
use GSPEM\GSPEMBundle\Entity\StockItemsMov;
use GSPEM\GSPEMBundle\Entity\StockTecnico;




use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\HttpFoundation\Session;


class StockController extends Controller
{

    public function getMaterialesStockAction(){
        $em = $this->getDoctrine()->getEntityManager();

        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("m.id as id ,m.ubicacion as ubicacion, m.umbralmax as umbralmax , m.umbralmin as umbralmin,m.referencia as referencia ,m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
            ->from("materiales", "m")
            ->innerJoin("m", "stock_maestro", "s", "m.id = s.material")
            ->orderBy('m.name', 'ASC')
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }

    public function getMaterialesStockByUserAction(){
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->get('security.token_storage')->getToken()->getUser();
        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("m.id as id ,m.referencia as referencia , m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
            ->from("materiales", "m")
            ->innerJoin("m", "stock_tecnico", "s", "m.id = s.material")
            ->where("s.tecnico =".$user->getId())
            ->orderBy('m.name', 'ASC')
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }

    public function getMaterialesStockByUserCustomAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->get('security.token_storage')->getToken()->getUser();
        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("m.id as id ,m.referencia as referencia , m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
            ->from("materiales", "m")
            ->innerJoin("m", "stock_tecnico", "s", "m.id = s.material")
            ->where("s.tecnico =".$request->get("id"))
            ->orderBy('m.name', 'ASC')
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }

    public function getMaterialesStockFromTecnicosAction(){
        $em = $this->getDoctrine()->getEntityManager();
        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("m.id as id ,u.id as tecid , CONCAT (u.first_name ,' ', u.last_name ) as tecnico  ,m.referencia as referencia , m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
            ->from("materiales", "m")
            ->innerJoin("m", "stock_tecnico", "s", "m.id = s.material")
            ->leftJoin("s","users" ,"u","s.tecnico=u.id" )
            ->orderBy('m.name', 'ASC')
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }


    public function getStockByContratistaAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();

        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("m.id as id ,u.first_name as nametec , u.last_name as apetec  ,m.referencia as referencia , m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
            ->from("materiales", "m")
            ->innerJoin("m", "stock_tecnico", "s", "m.id = s.material")
            ->innerJoin("s", "users", "u", "s.tecnico = u.id")
            ->innerJoin("u", "contratistas", "c", "u.contratista = c.id")
            ->where("c.id =".$request->get("id"))
            ->orderBy('u.id', 'ASC')
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }


    public function getAllStockContratistasAction(){
        $em = $this->getDoctrine()->getEntityManager();

        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("c.id as contratistaid , c.name as contratista , m.id as id ,u.first_name as nametec , u.last_name as apetec  ,m.referencia as referencia , m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
            ->from("materiales", "m")
            ->innerJoin("m", "stock_tecnico", "s", "m.id = s.material")
            ->innerJoin("s", "users", "u", "s.tecnico = u.id")
            ->innerJoin("u", "contratistas", "c", "u.contratista = c.id")
            ->orderBy('u.id', 'ASC')
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }


    public function getMaterialesStockBySiteCustomAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->get('security.token_storage')->getToken()->getUser();
        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("m.id as id ,m.referencia as referencia , m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
            ->from("materiales", "m")
            ->innerJoin("m", "stock_sitio", "s", "m.id = s.material")
            ->where("s.sitio =".$request->get("id"))
            ->orderBy('m.name', 'ASC')
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }

    public function getAllStockSiteCustomAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->get('security.token_storage')->getToken()->getUser();
        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("m.id as id ,s.sitio as sitioid , sit.name as namesit , m.referencia as referencia , m.id_custom as idCustom , m.descript as descript ,s.cant  as stock , m.name as name")
            ->from("materiales", "m")
            ->innerJoin("m", "stock_sitio", "s", "m.id = s.material")
            ->leftJoin("s", "sitios", "sit", "s.sitio = sit.id")
            ->orderBy('m.name', 'ASC')
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }


    public function setStockAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();

        $materialalertados=[];
        foreach (json_decode($request->getContent(),true)["items"] as $item){

            $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\StockMaestro');
            $stock = $repo->findOneBy(array("material"=>$item['id']));
            $stock->setCant($item['stock']);
            $em->flush();

        }


        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("response"=>true),"json"),200,array('Content-Type'=>'application/json'));
    }


    public function setStockUserAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();

        $data=json_decode($request->getContent(),true);

        if(isset($data["user"])){
            // viene desde transferencia de tecnico a tecnico

            if($data["user"]=="login"){
                // viene de un usuario logeado a otro tec
                $user_id=$this->get('security.token_storage')->getToken()->getUser()->getId();
            }else {
                // viene desde el administrador a otro tec
                $user_id=$data["user"];
            }
        }else {

            // viene desde transferencia desde maestro a tecnico
            $user_id=$this->get('security.token_storage')->getToken()->getUser()->getId();
        }

        foreach ($data["items"] as $item){
            $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\StockTecnico');
            $stock = $repo->findOneBy(array("material"=>$item['id'],"tecnico"=>$user_id));
            $stock->setCant($item['stock']);
            $em->flush();
        }

        /*if($data["user"]){
            $repoUsers =$em->getRepository('GSPEM\GSPEMBundle\Entity\User');
            $userOrigen=$repoUsers->findOneBy(array("id"=>$user_id));
            $userDestino=$repoUsers->findOneBy(array("id"=>$data["tecnico"]));


            $this->sendMailMovs($userOrigen->getLastName().' - '.$userOrigen->getFirstName(),"gabriel.adrian.felipe@gmail.com",new \DateTime(),$data["items"]);
        }else{
            $this->sendMailMovs("Stock Maestro","gabriel.adrian.felipe@gmail.com",new \DateTime(),$data["items"]);
        }*/



        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("response"=>true),"json"),200,array('Content-Type'=>'application/json'));
    }

    public function setStockSitioAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();

        $repoStockSit =$em->getRepository('GSPEM\GSPEMBundle\Entity\StockSitio');
        $sitio=json_decode($request->getContent(),true)["sitio"];


        $user_id=$this->get('security.token_storage')->getToken()->getUser()->getId();
        $stockTecMov= new MovStockTec();
        $stockTecMov->setState(1);
        $stockTecMov->setInicio(new \DateTime());
        $stockTecMov->setFin(new \DateTime());
        $stockTecMov->setOrigen($user_id);
        // movientos de tecnico a sitio

        $stockTecMov->setType(3);
        $stockTecMov->setTecnico($sitio);
        $em->persist($stockTecMov);
        $em->flush();



        foreach (json_decode($request->getContent(),true)["items"] as $item){
            $itemStockSit=$repoStockSit->findOneBy(array("sitio"=>$sitio,"material"=>$item['id']));
            if ($itemStockSit!=""){
                $itemStockSit->setCant($itemStockSit->getCant()+$item['stock']);
            }else{
                $StockSitio= new StockSitio();
                $StockSitio->setCant($item['stock']);
                $StockSitio->setSitio($sitio);
                $StockSitio->setMaterial($item['id']);
                $em->persist($StockSitio);
            }

            $stockItems= new StockItemsMov();
            $stockItems->setMaterial($item['id']);
            $stockItems->setMov($stockTecMov->getId());
            $stockItems->setCant($item['stock']);
            $em->persist($stockItems);

            $em->flush();
        }
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("response"=>true),"json"),200,array('Content-Type'=>'application/json'));
    }


    public function setStockToTecAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();


        $data=json_decode($request->getContent(),true);

        if(isset($data["origen"])){
            // si entra por aca , es de un tecnico a otro tec
            $from_tec=true;
            if($data["origen"]=="login"){
                // de un tecnico logeado a otro tec
                $user_id=$this->get('security.token_storage')->getToken()->getUser()->getId();
            }else{
                // del administrador que hace un moviminto de tec a otro tec
                $user_id=$data["origen"];
            }
        }else {
            $from_tec=false;
            $user_id=$this->get('security.token_storage')->getToken()->getUser()->getId();
        }

        $stockTecMov= new MovStockTec();
        $stockTecMov->setState(0);
        $stockTecMov->setInicio(new \DateTime());
        $stockTecMov->setOrigen($user_id);
        $fromMaestro=false;
        if($from_tec==true){
            // movientos entre tecnicos
            $stockTecMov->setType(2);
        }else {
            // moviemientos a tecnicos
            $fromMaestro=true;
            $stockTecMov->setType(1);
        }

        $stockTecMov->setTecnico($data["tecnico"]);

        $em->persist($stockTecMov);
        $em->flush();

        $i=0;
        $materialesToAlert=[];
        foreach ($data["items"] as $item){
            $stockItems= new StockItemsMov();
            $stockItems->setMaterial($item['id']);
            $stockItems->setMov($stockTecMov->getId());
            $stockItems->setCant($item['stock']);
            $em->persist($stockItems);
            $em->flush();

            $repoMat =$em->getRepository('GSPEM\GSPEMBundle\Entity\Material');
            $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\StockMaestro');


            $stockMaestro = $repo->findOneBy(array("material"=>$item['id']));
            $material=$repoMat->findOneBy(array("id"=>$item['id']));


            if($material->getUmbralmin()>= $stockMaestro->getCant() ){


                $materialToAlert=array("id"=>$material->getIdCustom(),'name'=>$material->getName(),"descript"=>$material->getDescript(),"stock"=>$stockMaestro->getCant());
                $materialesToAlert[$i]=$materialToAlert;
                $i++;
            }
        }





        $repoUsers =$em->getRepository('GSPEM\GSPEMBundle\Entity\User');
        $userOrigen=$repoUsers->findOneBy(array("id"=>$user_id));
        $userDestino=$repoUsers->findOneBy(array("id"=>$data["tecnico"]));

        if($fromMaestro){
            $this->sendMailMovs("Stock Maestro",$userDestino->getMail(),new \DateTime(),$data["items"]);
        }else{
            $this->sendMailMovs("Stock  - ".$userOrigen->getLastName().' - '.$userOrigen->getFirstName(),$userDestino->getMail(),new \DateTime(),$data["items"]);
        }


        if (count($materialesToAlert)==1){
            $message = \Swift_Message::newInstance()
                ->setSubject('Alerta de Stock - '.$material->getName())
                ->setFrom($this->container->getParameter('mailer_user'))
                ->setTo($this->container->getParameter('mail_alert'))
                ->setBody(
                    $this->renderView(
                    // app/Resources/views/Emails/registration.html.twig
                        'GSPEMGSPEMBundle:Default:mail_onealert.html.twig',
                        array('id'=>$material->getIdCustom(),'name'=>$material->getName(),"descript"=>$material->getDescript(),"stock"=>$stockMaestro->getCant())
                    ),
                    'text/html'
                );
            $this->get('mailer')->send($message);
        } elseif (count($materialesToAlert)>1)  {
                $message = \Swift_Message::newInstance()
                    ->setSubject('Alerta de Stock')
                    ->setFrom($this->container->getParameter('mailer_user'))
                    ->setTo($this->container->getParameter('mail_alert'))
                    ->setBody(
                        $this->renderView(
                        // app/Resources/views/Emails/registration.html.twig
                            'GSPEMGSPEMBundle:Default:mail_alerts.html.twig',
                            array('materiales'=>$materialesToAlert)),
                        'text/html'
                    );
                $this->get('mailer')->send($message);
        }



        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("response"=>true),"json"),200,array('Content-Type'=>'application/json'));
    }




    public function getMovimientosPendientesAction(){
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->get('security.token_storage')->getToken()->getUser();

        $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\MovStockTec');
        $mopendientes = $repo->findBy(array("tecnico"=>$user->getId(),"state"=>0));

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($mopendientes,"json"),200,array('Content-Type'=>'application/json'));
    }



    private function getUsersToShowMovs(){
        $user=$this->get('security.token_storage')->getToken()->getUser();

        $em = $this->getDoctrine()->getEntityManager();
        $childs=[];
        $childs[]=$user->getId(); // me paso yo mismo primero asi veo mis reportes
        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("u.id as id,u.level as  level , u.bosses as bosses")
            ->from("users", "u")
            ->orderBy("u.username")
            ->execute();
        foreach ($stmt->fetchAll() as $users){

            //var_dump($users['bosses']);
            if (!empty($users['bosses']))
            {
                $bosses=json_decode($users['bosses']);
                //var_dump($bosses);
                //die();
                $is_son=false;
                foreach ($bosses as $boss){

                    if($boss==$user->getId()){
                        // es mi hijo
                        $is_son=true;
                    }
                }
                if($is_son){
                    $childs[]=(int)$users['id'];
                }
            }

        }
        return $childs;
    }

    /**
     * Trae todo los movimientos - para reportes
     * @return Response
     */

    public function getAllMovimientosAction(){
        $em = $this->getDoctrine()->getEntityManager();
        //var_dump($this->getUsersToShowMovs());
        //die();
        // tecsitid puede ser el tecnico id  o un sitio id por eso ese nombre

        //$queryBuilder->andWhere('r.winner IN (:ids)')
         //   ->setParameter('ids', $ids);

        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("mov.id as id ,CONCAT (u.first_name ,' ',  u.last_name) 
            as tecnico,mov.tecnico as tecsitid, CONCAT (us.first_name ,' ', us.last_name) as origen ,
            mov.state as state ,mov.nota as nota ,mov.type as type,
            DATE_FORMAT(mov.fin, '%m-%d-%Y %h:%i') as fin ,
            DATE_FORMAT(mov.inicio, '%m-%d-%Y %h:%i') as inicio")
            ->from("movimiento_stock_tecnico", "mov")
            ->leftJoin("mov", "users", "u", "u.id = mov.tecnico")
            ->leftJoin("mov", "users", "us", "us.id = mov.origen")
            ->andWhere('u.id IN (:ids)')
            ->orWhere('us.id IN (:ids)')
            ->orderBy('mov.inicio', 'ASC')
            ->setParameter('ids', $this->getUsersToShowMovs(),\Doctrine\DBAL\Connection::PARAM_STR_ARRAY)
            ->execute();


        foreach ($stmt->fetchAll() as $mov){
            $item=[];

            $stmtItems = $em->getConnection()->createQueryBuilder()
                ->select("st.id as id_item ,m.referencia as referencia,st.cant, m.id as id , m.id_custom as idCustom , m.descript as descript , m.name as name")
                ->from("stock_items_mov", "st")
                ->innerJoin("st", "materiales", "m", "st.material = m.id")
                ->where("st.mov = ".$mov['id'])
                ->orderBy('m.name', 'ASC')
                ->execute();
            $item['id']=$mov['id'];
            $item['items']=$stmtItems->fetchAll();
            $item['inicio']=$mov['inicio'];
            $item['fin']=$mov['fin'];



            $item['origen']=$mov['origen'];
            if($mov['type']==3){
                //necesito sacar el nombre del sitio
                $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\Sitio');
                $sitio = $repo->findOneBy(array("id"=>$mov['tecsitid']));
                $item['tecnico']=$sitio->getName();
            }else {
                $item['tecnico']=$mov['tecnico'];
            }


            $item['nota']=$mov['nota'];
            $item['state']=$mov['state'];
            $item['type']=$mov['type'];

            $result[]=$item;
        }

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($result,"json"),200,array('Content-Type'=>'application/json'));
    }


    /**
     * Trae todo los movimientos pendientes con items
     * @return Response
     */

    public function getMovimientosPendientesItemsAction(){
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->get('security.token_storage')->getToken()->getUser();

        $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\MovStockTec');
        $mopendientes = $repo->findBy(array("tecnico"=>$user->getId(),"state"=>0));

        $result=[];

        foreach ($mopendientes as $mov){

            $item=[];

            $stmt = $em->getConnection()->createQueryBuilder()
                ->select("st.id as id_item ,m.referencia as referencia,st.cant, m.id as id , m.id_custom as idCustom , m.descript as descript , m.name as name")
                ->from("stock_items_mov", "st")
                ->innerJoin("st", "materiales", "m", "st.material = m.id")
                ->where("st.mov = ".$mov->getId())
                ->orderBy('m.name', 'ASC')
                ->execute();
            $item['id']=$mov->getId();
            $item['items']=$stmt->fetchAll();
            $item['inicio']=$mov->getInicio()->format('Y-m-d H:i:s');;
            $item['origen']=$mov->getOrigen();
            //var_dump($mov->getInicio());
            //die();
            $result[]=$item;
        }

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($result,"json"),200,array('Content-Type'=>'application/json'));
    }


    public function getMovimientosRechazadosAction(){
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->get('security.token_storage')->getToken()->getUser();

        $stmt = $em->getConnection()->createQueryBuilder()
            ->select("st.id as idMov ,movs.type as typeMov,st.material as idMat, movs.tecnico as origen_id,movs.nota as nota, movs.inicio as inicio ,  movs.fin as fin , CONCAT (us.first_name ,'  ', us.last_name) as origen_name ,  m.referencia as referencia,st.rechazado, m.id as id , m.id_custom as idCustom , m.descript as descript , m.name as name")
            ->from("stock_items_mov", "st")
            ->innerJoin("st", "materiales", "m", "st.material = m.id")
            ->innerJoin("st", "movimiento_stock_tecnico", "movs", "st.mov = movs.id")
            ->innerJoin("movs", "users", "us", "movs.tecnico = us.id")
            ->where("st.status =0")
            ->andWhere("movs.origen = ".$user->getId())
            ->execute();
        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize($stmt->fetchAll(),"json"),200,array('Content-Type'=>'application/json'));
    }

    /**
     * Acepto los rechados
     */
    public function  aceptRechazadosAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->get('security.token_storage')->getToken()->getUser();

        $repoStockTec =$em->getRepository('GSPEM\GSPEMBundle\Entity\StockTecnico');
        $repoStockMestro =$em->getRepository('GSPEM\GSPEMBundle\Entity\StockMaestro');
        $repoItemsMov =$em->getRepository('GSPEM\GSPEMBundle\Entity\StockItemsMov');
        $data=json_decode($request->getContent(),true);


        $logger = $this->get('logger');
        $logger->error($data);
        $logger->info('test');



        $itemMov =$repoItemsMov->findOneBy(array("id"=>$request->get('item_id')));
        $itemMov->setStatus(1);
        $em->flush();

        if ($request->get('type')==1){
            //devuevlo al maestro los rechazados por el tecnico
            $itemStockTec=$repoStockMestro->findOneBy(array("material"=>$request->get('id')));
            if ($itemStockTec!=""){
                $itemStockTec->setCant($itemStockTec->getCant()+(int) $request->get('cant'));
            }
            $em->flush();
        }else{
            //devuelvo al tecnio de origen los parcialmente rechazados
            $itmeStockTec=$repoStockTec->findOneBy(array("material"=>$request->get('id'),"tecnico"=>$user->getId()));
            if ($itmeStockTec!=""){
                $itmeStockTec->setCant($itmeStockTec->getCant()+(int) $request->get('cant'));
            }
            $em->flush();
        }


        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("process"=>true),"json"),200,array('Content-Type'=>'application/json'));
    }



    /**
     * Aceptacion y rechazo de stock
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @return Response
     */
    public function aceptarMovPendientesAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->get('security.token_storage')->getToken()->getUser();

        $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\MovStockTec');
        $repoItemsMov =$em->getRepository('GSPEM\GSPEMBundle\Entity\StockItemsMov');
        $repoStockTec =$em->getRepository('GSPEM\GSPEMBundle\Entity\StockTecnico');
        $repoStockMestro =$em->getRepository('GSPEM\GSPEMBundle\Entity\StockMaestro');

        $data=json_decode($request->getContent(),true);

        $movimiento = $repo->findOneBy(array("id"=>$data['id']));


        if($data['items_rejected']!="" && count($data['items_rejected']>0)){


            // seteo estodo 3 , aceptado pero con algnunos rechazos
            $movimiento->setState(3);
            $movimiento->setNota($data['nota']);
            //asigno rechazados



            $itemsRejected=[];
            foreach ($data["items_rejected"] as $item){

                //seteo al movimiento los rechazos
                $itemMov=$repoItemsMov->findOneBy(array("id"=>($item['id_item'])));
                $itemMov->setRechazado($item['cantrechazo']);
                $itemsRejected[]=array("id"=>$itemMov->getMaterial(),"stock"=>$item['cantrechazo']);
                $itemMov->setStatus(0);
                $em->flush();
                /*if ($movimiento->getType()==1){
                    //devuevlo al maestro los rechazados por el tecnico
                    $itemStockTec=$repoStockMestro->findOneBy(array("material"=>$item['id'],));
                    if ($itemStockTec!=""){
                        $itemStockTec->setCant($itemStockTec->getCant()+(int) $item['cantrechazo']);
                    }
                    $em->flush();
                }else{
                    //devuelvo al tecnio de origen los parcialmente rechazados
                    $itmeStockTec=$repoStockTec->findOneBy(array("material"=>$item['id'],"tecnico"=>$movimiento->getOrigen()));
                    if ($itmeStockTec!=""){
                        $itmeStockTec->setCant($itmeStockTec->getCant()+(int)$item['cantrechazo']);
                    }
                    $em->flush();
                }*/
            }
            // envio mail con los rechazados ...............
            $repoUsers =$em->getRepository('GSPEM\GSPEMBundle\Entity\User');
            $userOrigen=$repoUsers->findOneBy(array("id"=>$movimiento->getOrigen()));
            $this->sendMailMovs("Stock Rechazado de   - ".$user->getLastName().' - '.$user->getFirstName(),$userOrigen->getMail(),new \DateTime(),$itemsRejected,true,$data['nota']);
            //----------------------------------------------

        }else{
            $movimiento->setState(1);
        }




        $movimiento->setFin(new \DateTime());
        $em->flush();

        // recorro los items de ese movimiento y los paso al stock de usuario

        $itmesMov=$repoItemsMov->findBy(array("mov"=>$data['id']));

        foreach ($itmesMov as $movitem){
            $itemStockTec=$repoStockTec->findOneBy(array("tecnico"=>$movimiento->getTecnico(),"material"=>$movitem->getMaterial()));
            if ($itemStockTec!=""){
                if($movitem->getRechazado()>0){
                    $itemStockTec->setCant($itemStockTec->getCant()+ ($movitem->getCant()-$movitem->getRechazado()));
                }else{
                    $itemStockTec->setCant($itemStockTec->getCant()+$movitem->getCant());
                }

            }else{
                $itmeTecNew= new StockTecnico();
                if($movitem->getRechazado()>0) {
                    $itmeTecNew->setCant($itmeTecNew->getCant() + ($movitem->getCant() - $movitem->getRechazado()));
                }else {
                    $itmeTecNew->setCant($movitem->getCant());
                }
                $itmeTecNew->setTecnico($movimiento->getTecnico());
                $itmeTecNew->setMaterial($movitem->getMaterial());
                $em->persist($itmeTecNew);
            }
            $em->flush();
        }

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("process"=>true),"json"),200,array('Content-Type'=>'application/json'));
    }




    /**
     * Rechazo de todos los items
     * @param \Symfony\Component\HttpFoundation\Request $request
     * @return Response
     */
    public function rechazarMovPendientesAction(\Symfony\Component\HttpFoundation\Request $request){
        $em = $this->getDoctrine()->getEntityManager();
        $user=$this->get('security.token_storage')->getToken()->getUser();

        $repo =$em->getRepository('GSPEM\GSPEMBundle\Entity\MovStockTec');
        $repoItemsMov =$em->getRepository('GSPEM\GSPEMBundle\Entity\StockItemsMov');
        $repoStockMestro =$em->getRepository('GSPEM\GSPEMBundle\Entity\StockMaestro');
        $repoStockTec =$em->getRepository('GSPEM\GSPEMBundle\Entity\StockTecnico');

        $movimiento = $repo->findOneBy(array("id"=>$request->get("id")));
        $movimiento->setState(2);
        $tecOrigen=$movimiento->getOrigen();
        $movimiento->setNota($request->get("nota"));
        $movimiento->setFin(new \DateTime());
        $em->flush();

        // recorro los items de ese movimiento y los paso al stock de usuario

        $itmesMov=$repoItemsMov->findBy(array("mov"=>$request->get("id")));


        $itemsRejected=[];
        foreach ($itmesMov as $movitem){

            $movitem->setStatus(0);
            $movitem->setRechazado($movitem->getCant());
            $em->flush();
            $itemsRejected[]=array("id"=>$movitem->getMaterial(),"stock"=>$movitem->getCant());
            /*if ($movimiento->getType()==1){
                // tipo 1  , viene desde el stock maestro
                $itemStockTec=$repoStockMestro->findOneBy(array("material"=>$movitem->getMaterial(),));
                if ($itemStockTec!=""){
                    $itemStockTec->setCant($itemStockTec->getCant()+$movitem->getCant());
                }
                $em->flush();
            } else {
                // tipo 2  , viene desde otro tecnico
                $itmeStockTec=$repoStockTec->findOneBy(array("material"=>$movitem->getMaterial(),"tecnico"=>$movimiento->getOrigen()));
                if ($itmeStockTec!=""){
                    $itmeStockTec->setCant($itmeStockTec->getCant()+$movitem->getCant());
                }
                $em->flush();
            }*/
        }

        // envio mail con los rechazados ...............
        $repoUsers =$em->getRepository('GSPEM\GSPEMBundle\Entity\User');
        $userOrigen=$repoUsers->findOneBy(array("id"=>$tecOrigen));
        $this->sendMailMovs("Stock Rechazado de   - ".$user->getLastName().' - '.$user->getFirstName(),$userOrigen->getMail(),new \DateTime(),$itemsRejected,true,$request->get("nota"));
        //------------------------------

        $encoders = array(new XmlEncoder(), new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());

        $serializer = new Serializer($normalizers, $encoders);
        return new Response($serializer->serialize(array("process"=>true),"json"),200,array('Content-Type'=>'application/json'));
    }




    private function sendMailMovs($origen, $to,$fecha , $items,$rechazo=false,$motivo=""){
        $em = $this->getDoctrine()->getEntityManager();
        $repoMat =$em->getRepository('GSPEM\GSPEMBundle\Entity\Material');


        $logger = $this->get('logger');
        $logger->error("send Mail");


        $logger->error(print_r($items, true));

        if($motivo!=""){
            $motivo="Nota :".$motivo;
        }
        $materiales=[];
        foreach ($items as $item){
            $material=$repoMat->findOneBy(array("id"=>$item["id"]));
            //$logger->error($material->getIdCustom());
            $mat['id']=$material->getIdCustom();
            $mat['name']=$material->getName();
            $mat['descript']=$material->getDescript();
            $mat['cant']=$item['stock'];
            $logger->error("material id".$mat['id']);
            $materiales[]=$mat;

        }
        //$logger->error(print_r($materiales));

        if ($rechazo){
            $mensaje="Tienes stock rechazado para aceptar";
        }else{
            $mensaje="Tienes nuevo envio de stock pendiente para aceptar";
        }


        $message = \Swift_Message::newInstance()
            ->setSubject('Sock pendiente para aceptar ')
            ->setFrom($this->container->getParameter('mailer_user'))
            ->setTo($to)
            ->setBody(
                $this->renderView(
                    'GSPEMGSPEMBundle:Default:mail_alerts_mov.html.twig',
                    array('message'=>$mensaje,'motivo'=>$motivo,'origen'=>$origen,'fecha'=>$fecha,'items'=>$materiales)
                ),
                'text/html'
            );
        $this->get('mailer')->send($message);

    }
}
