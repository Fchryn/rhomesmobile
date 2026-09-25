<?php 
namespace App\Models;

use CodeIgniter\Model;
use CodeIgniter\Database\Query;

class UserModel extends Model
{
    function users()
    {
        $group_data = [

        //////////////////////////////////////////////////////////////////////////////////////////
        // GROUP RHOMES
        //////////////////////////////////////////////////////////////////////////////////////////

        [
            'role'     => 'admin_rhomes',
            'modul'    => ['man','lkt','yan','kas','inv','acc','mas','lap','dks'],
            'coa'      => 'edit',
            'layanan'  => 'all',
            'type'     => 'live',
            'db'       => 'livedb',
            'menu'     => 1
        ],[
            'role'     => 'all_rhomes',
            'modul'    => ['man','lkt','yan','kas','inv','acc','mas','lap','dks'],
            'coa'      => 'view',
            'layanan'  => 'all',
            'type'     => 'regular',
            'db'       => 'livedb',
            'menu'     => 1
        ],[
            'role'     => 'user_rhomes',
            'modul'    => ['MAN','LKT','YAN','KAS'],
            'coa'      => 'view',
            'layanan'  => 'all',
            'type'     => 'regular',
            'db'       => 'livedb',
            'menu'     => 1
        ],[
            'role'     => 'swasta_rhomes',
            'modul'    => ['man','lkt','yan','kas','inv','acc','mas','lap'],
            'coa'      => 'view',
            'layanan'  => 'all',
            'type'     => 'regular',
            'db'       => 'livedb',
            'menu'     => 1
        ],[
            'role'     => 'loket_rhomes',
            'modul'    => ['man','LKT','yan'],
            'layanan'  => 'all',
            'coa'      => 'view',
            'type'     => 'live',
            'db'       => 'livedb',
            'menu'     => 0
        ],[
            'role'     => 'umum_rhomes',
            'modul'    => ['YAN'],
            'layanan'  => 102,
            'coa'      => 'view',
            'type'     => 'live',
            'db'       => 'livedb',
            'menu'     => 0
        ],[
            'role'     => 'igd_rhomes',
            'modul'    => ['YAN'],
            'layanan'  => 110,
            'coa'      => 'view',
            'type'     => 'live',
            'db'       => 'livedb',
            'menu'     => 0
        ],[
            'role'     => 'kasir_rhomes',
            'modul'    => ['KAS'],
            'layanan'  => 'all',
            'coa'      => 'view',
            'type'     => 'live',
            'db'       => 'livedb',
            'menu'     => 0
        ],[
            'role'     => 'demo_rhomes',
            'modul'    => ['man','lkt','yan','kas','inv','acc','mas','lap','dks'],
            'coa'      => 'view',
            'layanan'  => 'all',
            'type'     => 'demo',
            'db'       => 'demodb',
            'menu'     => 1
        ],
        [
            'role'     => 'apotik_rhomes',
            'modul'    => ['man','lkt','yan','kas','inv','acc','mas','lap','dks'],
            'coa'      => 'view',
            'layanan'  => 136,
            'type'     => 'live',
            'db'       => 'livedb',
            'menu'     => 1
        ],
        [
            'role'     => 'klinik_kecantikan_rhomes',
            'modul'    => ['man','lkt','yan','kas','inv','acc','mas','lap','dks'],
            'coa'      => 'view',
            'layanan'  => 'all',
            'type'     => 'regular',
            'db'       => 'livedb',
            'menu'     => 1
        ],
        [
            'role'     => 'inventory_rhomes',
            'modul'    => ['INV'],
            'layanan'  => 'all',
            'coa'      => 'view',
            'type'     => 'live',
            'db'       => 'livedb',
            'menu'     => 0
        ],
        /////////////////////////new role////////////////////
        [
            'role'     => 'admin_bussiness',
            'modul'    => ['bus'],
            'coa'      => 'edit',
            'layanan'  => 'all',
            'type'     => 'live',
            'db'       => 'livedb',
            'menu'     => 5
        ],
        [
            'role'     => 'creator_bussiness',
            'modul'    => ['bus'],
            'coa'      => 'view',
            'layanan'  => 'all',
            'type'     => 'live',
            'db'       => 'livedb',
            'menu'     => 6
        ],
        [
            'role'     => 'viewer_bussiness',
            'modul'    => ['bus'],
            'coa'      => 'view',
            'layanan'  => 'all',
            'type'     => 'live',
            'db'       => 'livedb',
            'menu'     => 7
        ],
        //////////////////////////////////////////////////////////////////////////////////////////
        // GROUP SIREDISH
        //////////////////////////////////////////////////////////////////////////////////////////

        [
            'role'     => 'admin_siredish',
            'color'    => 'lightgreen',
            'modul'    => ['man','hwn','lkt','yan','kas','inv','acc','mas'],
            'layanan'  => 'all',
            'coa'      => 'edit',
            'type'     => 'live',
            'db'       => 'livedb',
            'menu'     => 1
        ],[
            'role'     => 'user_siredish',
            'color'    => 'lightgreen',
            'modul'    => ['MAN','HWN','LKT','YAN','KAS'],
            'coa'      => 'view',
            'layanan'  => 'all',
            'type'     => 'live',
            'db'       => 'livedb',
            'menu'     => 1
        ],
        
        //////////////////////////////////////////////////////////////////////////////////////////
        // GROUP RECLIENS
        //////////////////////////////////////////////////////////////////////////////////////////
        
        [
            'role'     => 'admin_recliens',
            'color'    => 'peachpuff',
            'modul'    => ['man','lkt','yan','kas','mas'],
            'coa'      => 'edit',
            'layanan'  => 102,
            'type'     => 'live',
            'db'       => 'livedb',
            'menu'     => 1
        ],[
            'role'     => 'user_recliens',
            'color'    => 'peachpuff',
            'modul'    => ['MAN','LKT','YAN','KAS'],
            'coa'      => 'view',
            'layanan'  => 'all',
            'type'     => 'live',
            'db'       => 'livedb',
            'menu'     => 1
        ],[
            'role'     => 'rd_recliens',
            'modul'    => ['MAN'],
            'coa'      => 'view',
            'layanan'  => 'all',
            'type'     => 'live',
            'db'       => 'livedb',
            'menu'     => 1
        ]];

        $user_data = [

        //////////////////////////////////////////////////////////////////////////////////////////
        // USER RHOMES
        //////////////////////////////////////////////////////////////////////////////////////////
        //lang => 0 = indonesia
        //lang => 1 = inggris
        [
            'username' => 'admin.rsa',
            'password' => 'rhocs2025-d321',
            'role'     => 'all_rhomes',
            'nama'     => 'Panji Darusman',
            'db'       => 'livedb',
            'sdm_id'   => 84,
            'lok_id'   => 12,
            'lang'     => 0
        ],[
            'username' => 'user.rsa',
            'password' => 'rhocs2023',
            'role'     => 'user_rhomes',
            'nama'     => 'Yunita Nur Fajriah',
            'db'       => 'livedb',
            'sdm_id'   => 249,
            'lok_id'   => 12,
            'lang'     => 0
        ],[
            'username' => 'admin.swasta',
            'password' => 'demo',
            'role'     => 'swasta_rhomes',
            'nama'     => 'Restu Wahyu A',
            'db'       => 'livedb',
            'sdm_id'   => 248,
            'lok_id'   => 12,
            'lang'     => 0
        ],[
            'username' => 'user.swasta',
            'password' => 'demo',
            'role'     => 'user_rhomes',
            'nama'     => 'Elia Indah Meilina',
            'db'       => 'livedb',
            'sdm_id'   => 246,
            'lok_id'   => 12,
            'lang'     => 0
        ],[
            'username' => 'apotik.rsa',
            'password' => 'demo',
            'role'     => 'apotik_rhomes',
            'nama'     => 'Yuvita Dian Damayanti',
            'db'       => 'livedb',
            'sdm_id'   => 276,
            'lok_id'   => 12,
            'lang'     => 0,
            'apotik'   => 1
        ],[
            'username' => 'loket.rsa',
            'password' => 'demo',
            'role'     => 'loket_rhomes',
            'nama'     => 'Yuni Ambarwati Chang',
            'db'       => 'livedb',
            'lok_id'   => 12,
            'sdm_id'   => 12,
            'kamaronly'=> 1,
            'lang'     => 0
        ],
        [
            'username' => 'admin.rsa.en',
            'password' => 'demo',
            'role'     => 'all_rhomes',
            'nama'     => 'Panji Darusman',
            'db'       => 'livedb',
            'sdm_id'   => 84,
            'lok_id'   => 12,
            'lang'     => 1,
        ],[
            'username' => 'umum.rsa',
            'password' => 'demo',
            'role'     => 'umum_rhomes',
            'nama'     => 'Didik Sunarto',
            'db'       => 'livedb',
            'lok_id'   => 12,
            'sdm_id'   => 11,
            'rsa'      => 1,
            'lang'     => 0
        ],[
            'username' => 'igdkaber.rsa',
            'password' => 'demo',
            'role'     => 'igd_rhomes',
            'nama'     => 'Drh. Hurif Bambang Sugeng',
            'db'       => 'livedb',
            'lok_id'   => 12,
            'sdm_id'   => 13,
            'rsa'      => 1,
            'kandungan'=> 1,
            'lang'     => 0
        ],[
            'username' => 'igd.rsa',
            'password' => 'demo',
            'role'     => 'igd_rhomes',
            'nama'     => 'Drh. Hurif Bambang Sugeng',
            'db'       => 'livedb',
            'lok_id'   => 12,
            'sdm_id'   => 13,
            'rsa'      => 1,
            'kandungan'=> 1,
            'lang'     => 0
        ],[
            'username' => 'kasir.rsa',
            'password' => 'demo',
            'role'     => 'kasir_rhomes',
            'nama'     => 'Santikarini Dewi Kasih',
            'db'       => 'livedb',
            'lok_id'   => 12,
            'sdm_id'   => 15,
            'lang'     => 0
        ],[
            'username' => 'demorhomes',
            'password' => 'demo',
            'role'     => 'demo_rhomes',
            'nama'     => 'Akun Demo',
            'db'       => 'demodb',
            'lok_id'   => 12,
            'sdm_id'   => 15,
            'lang'     => 0
        ],[
            'username' => 'usercant',
            'password' => 'demo',
            'role'     => 'klinik_kecantikan_rhomes',
            'nama'     => 'Dr. Julia Dwi Nasution',
            'db'       => 'livedb',
            'lok_id'   => 15,
            'sdm_id'   => 287,
            'lang'     => 0,
            'user'     => 1
        ],[
            'username' => 'bisnis.admin',
            'password' => 'demo',
            'role'     => 'admin_bussiness',
            'nama'     => 'dr. Viga Natasa',
            'db'       => 'livedb',
            'lok_id'   => 16,
            'sdm_id'   => 12,
            'lang'     => 0
        ],
        [
            'username' => 'bisnis.creator',
            'password' => 'demo',
            'role'     => 'creator_bussiness',
            'nama'     => 'dr. Elisa',
            'db'       => 'livedb',
            'lok_id'   => 16,
            'sdm_id'   => 13,
            'lang'     => 0
        ],
        [
            'username' => 'bisnis.viewer',
            'password' => 'demo',
            'role'     => 'viewer_bussiness',
            'nama'     => 'dr. Sakinah',
            'db'       => 'livedb',
            'lok_id'   => 16,
            'sdm_id'   => 14,
            'lang'     => 0
        ],
        [
            'username' => 'driver.cant',
            'password' => 'demo',
            'role'     => 'inventory_rhomes',
            'nama'     => 'Dr. Julia Dwi Nasution',
            'db'       => 'livedb',
            'lok_id'   => 15,
            'sdm_id'   => 287,
            'lang'     => 0
        ],
        [
            'username' => 'rduser',
            'password' => 'demo',
            'role'     => 'rd_recliens',
            'nama'     => 'Naufal',
            'db'       => 'livedb',
            'lok_id'   => 19,
            'sdm_id'   => 287,
            'lang'     => 0
        ],

        //////////////////////////////////////////////////////////////////////////////////////////
        // USER SIREDISH
        //////////////////////////////////////////////////////////////////////////////////////////

        [
            'username' => 'siredish',
            'password' => 'rhocs2025-d321',
            'role'     => 'admin_siredish',
            'nama'     => 'Gigih Ringganu',
            'db'       => 'livedb',
            'sdm_id'   => 14,
            'lok_id'   => 11,
            'lang'     => 0
        ],
        [
            'username' => 'user.siredish',
            'password' => 'rhocs2025-d321',
            'role'     => 'user_siredish',
            'nama'     => 'Dr. Komaruddin',
            'db'       => 'livedb',
            'sdm_id'   => 14,
            'lok_id'   => 11,
            'lang'     => 0
        ],[
            'username' => 'provet.pbaru',
            'password' => '123cherry',
            'role'     => 'admin_siredish',
            'nama'     => 'drh. Hardjono',
            'db'       => 'livedb',
            'sdm_id'   => 21,
            'lok_id'   => 14,
            'lang'     => 0
        ],

        //////////////////////////////////////////////////////////////////////////////////////////
        // USER RECLIENS
        //////////////////////////////////////////////////////////////////////////////////////////

        [
            'username' => 'recliens',
            'password' => 'rhocs2025-d321',
            'role'     => 'admin_recliens',
            'nama'     => 'Dian Sulistyowati S.Apt',
            'db'       => 'livedb',
            'lok_id'   => 13,
            'sdm_id'   => 19,
            'lang'     => 0
        ],
        [
            'username' => 'user.recliens',
            'password' => 'rhocs2025-d321',
            'role'     => 'user_recliens',
            'nama'     => 'Dian Sulistyowati S.Apt',
            'db'       => 'livedb',
            'lok_id'   => 13,
            'sdm_id'   => 19,
            'lang'     => 0
        ],
        [
            'username' => 'recliens-en',
            'password' => 'demo',
            'role'     => 'admin_recliens',
            'nama'     => 'Dian Sulistyowati S.Apt',
            'db'       => 'livedb',
            'lok_id'   => 13,
            'sdm_id'   => 19,
            'lang'     => 1
        ]];

        foreach($user_data as &$u){
            foreach($group_data as $g) {
                if ($g['role'] == $u['role']) {
                    $u = array_merge($u, $g);
                    break;
                }
            }
        }

        return $user_data;
    }
    function newuser()
    {
        $db = db_connect('livedb');
        $result['status'] = 'failed';
        $result['data'] = [];
        $arraymodul = [];
        $query = $db->query("SELECT grp_coa coa, grp_color color, grp_db db, grp_layanan layanan, grp_menu menu, grp_modul modul, grp_role role, grp_type type, log_lang lang, log_lok_id lok_id, log_nama nama, log_sdm_id sdm_id, log_username username, log_password password FROM rms_login 
            LEFT JOIN rms_group ON grp_id=log_grp_id
            WHERE log_username='".$_POST['username']."'
            AND log_password='".$_POST['password']."'");
        $error = $db->error();
        if ($error['code'] == 0) {
            $row = $query->getRow();
            
            $dataexplode = explode(",",$row->modul);
            foreach($dataexplode as $data2) {
                $querymodul = $db->query("SELECT mod_nama FROM rms_modul WHERE mod_id=".$data2);
                $rowmodul = $querymodul->getRow();
                array_push($arraymodul,$rowmodul->mod_nama);
            }
            if($row) {
                $result = $row;
            }
        }

        return $result;
    }
    
    public function check()
    {
        $username = $_POST['username'];
        $password = $_POST['password'];

        $result['status'] = 'failed';
        $data = $this->users();
        foreach($data as $d) {
            if ($d['username'] == $username && $d['password'] == $password) {
                $modul = [
                    'man'=>0,
                    'hwn'=>0,
                    'lkt'=>0,
                    'yan'=>0,
                    'kas'=>0,
                    'inv'=>0,
                    'acc'=>0,
                    'mas'=>0,
                    'rep'=>0,
                    'bus'=>0
                ];
                foreach($d['modul'] as $i) {
                    if (preg_match('~^\p{Lu}~u', $i)) // cek huruf besar atau tidak
                        $modul[strtolower($i)] = 2;
                    else
                        $modul[$i] = 1;
                }
                $d['modul'] = $modul;
                $result['status'] = 'success';
                $result['login_data'] = $d;
                break;
            }
        }
        return $result;
    }
    public function backupDatabase()
    {
        $result['status'] = "success";
        $folder = 'public/backup/reenduxs_rhomes/';
        $date = date_create(null, timezone_open("Asia/Jakarta"));
        $date->modify('-1 days');
        $filename = $folder.'rhomes-db-'.date_format($date, 'Ymd');
        if (file_exists($filename.'.zip')) {
            unlink($filename.'.zip');
        }
        $sql = "";
        $db = db_connect('livedb');
        $query = $db->query("SHOW TABLES");
        $rows = $query->getResult();
        foreach($rows as $r) {
            $table = $r->Tables_in_reenduxs_rhomes;
            $sql .= "DROP TABLE IF EXISTS ".$table.";\n";

            // ambil script untuk create table
            $query = $db->query("SHOW CREATE TABLE ".$table);
            $row = $query->getRowArray();
            $sql .= $row['Create Table'].";\n";

            // ambil daftar field
            $fieldType = [];
            $fields = "";
            $query = $db->query("DESC ".$table);
            foreach($query->getResult() as $f) {
                if ($fields != "") $fields .= ", ";
                $fields .= $f->Field;
                $fieldType[$f->Field] = $f->Type;
            }
            
            // ambil data record
            $query = $db->query("SELECT * FROM ".$table);
            $values = "";
            $tablerows = $query->getResult();
            foreach($tablerows as $trow) {
                if ($values != "") $values .= ",";
                $values .= "\n   (";
                $valofrec = "";
                foreach($trow as $key=>$r) {
                    if ($valofrec != "") $valofrec .= ", ";
                    $val = "null";
                    if (isset($r)) {
                        if (strstr($fieldType[$key], 'int')||
                            strstr($fieldType[$key], 'decimal'))
                            $val = $r;
                        elseif (strstr($fieldType[$key], 'varchar')||
                            strstr($fieldType[$key], 'datetime')||
                            strstr($fieldType[$key], 'blob'))
                            $val = "'".$r."'";
                        else
                            $val = "'".$r."'";
                    }
                    $valofrec .= $val;
                }
                $values .= $valofrec;
                $values .= ")";
            }
            if ($values != "")
                $sql .= "INSERT INTO ".$table."(".$fields.") VALUES".$values.";\n";
            $sql .= "\n";
        }
        $handle = fopen($filename.'.sql','w');
        fwrite($handle, $sql);
        fclose($handle);
        exec('/usr/bin/zip -j '.$filename.'.zip '.$filename.'.sql');
        
        // pengiriman ke WAG
        // eRDe Backup DB Kasbon, Group ID : -646107799
        
        // $this->sendFileToTEG(base_url($filename.'.zip'), "-1001685263849");
        // chat id lama tidak bisa dipakai karena group chat
        // sudah diupgrade ke super group chat. Chat id lama: -646107799);
        
        unlink($filename.'.sql');
        
        return $result;
    }
}
