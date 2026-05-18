-- ============================================================
-- Memoria テンプレートシード
-- カテゴリ単位で append していく
-- 適用: psql $DATABASE_URL -f db/seeds/template_seeds.sql
-- ============================================================

-- ============================================================
-- [1] スポーツ > 野球 > NPB（12球団）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('阪神タイガース', array['スポーツ','野球','NPB'], '[
  {"label":"タイガースファン歴は？","placeholder":"例：生まれた時から"},
  {"label":"甲子園に年何回行く？","placeholder":"例：年10回、ライトスタンド一択"},
  {"label":"推し選手は？","placeholder":"例：近本光司、佐藤輝明"},
  {"label":"タイガースを好きになったきっかけは？","placeholder":"例：親父に連れてってもらって"},
  {"label":"観戦スタイルは？","placeholder":"例：外野で六甲おろし全力派"},
  {"label":"忘れられない場面は？","placeholder":"例：2023年38年ぶり日本一"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：ホーム・ビジター両方"},
  {"label":"アウェー遠征したことある？","placeholder":"例：東京ドームに毎年"},
  {"label":"阪神のここが好き！","placeholder":"例：甲子園の一体感がたまらない"}
]'),

('読売ジャイアンツ', array['スポーツ','野球','NPB'], '[
  {"label":"巨人ファン歴は？","placeholder":"例：30年以上"},
  {"label":"東京ドームに年何回行く？","placeholder":"例：年5回"},
  {"label":"推し選手は？","placeholder":"例：岡本和真、菅野智之"},
  {"label":"巨人を好きになったきっかけは？","placeholder":"例：長嶋さんの時代から"},
  {"label":"観戦スタイルは？","placeholder":"例：内野で落ち着いて見る派"},
  {"label":"忘れられない場面は？","placeholder":"例：ON時代の記憶、最近は岡本の活躍"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：黒ユニが好き"},
  {"label":"アウェー遠征したことある？","placeholder":"例：甲子園に殴り込み"},
  {"label":"巨人のここが好き！","placeholder":"例：伝統と格式が好き"}
]'),

('横浜DeNAベイスターズ', array['スポーツ','野球','NPB'], '[
  {"label":"ベイスターズファン歴は？","placeholder":"例：暗黒時代から応援してます"},
  {"label":"横浜スタジアムに年何回行く？","placeholder":"例：年15回、DB応援団席"},
  {"label":"推し選手は？","placeholder":"例：牧秀悟、山崎康晃"},
  {"label":"ベイを好きになったきっかけは？","placeholder":"例：横浜出身だから"},
  {"label":"観戦スタイルは？","placeholder":"例：外野でハマスタ揺らす派"},
  {"label":"忘れられない場面は？","placeholder":"例：2024年日本一、筒香時代"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：三浦番長の復刻ユニ持ってる"},
  {"label":"アウェー遠征したことある？","placeholder":"例：甲子園まで行った"},
  {"label":"ベイスターズのここが好き！","placeholder":"例：ハマスタの雰囲気が最高"}
]'),

('中日ドラゴンズ', array['スポーツ','野球','NPB'], '[
  {"label":"ドラゴンズファン歴は？","placeholder":"例：落合監督時代から"},
  {"label":"バンテリンドームに年何回行く？","placeholder":"例：年8回"},
  {"label":"推し選手は？","placeholder":"例：高橋宏斗、大島洋平"},
  {"label":"中日を好きになったきっかけは？","placeholder":"例：愛知出身なので"},
  {"label":"観戦スタイルは？","placeholder":"例：内野で静かに見る名古屋スタイル"},
  {"label":"忘れられない場面は？","placeholder":"例：落合監督8年間の黄金期"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：ドアラグッズも持ってる"},
  {"label":"アウェー遠征したことある？","placeholder":"例：甲子園に乗り込んだ"},
  {"label":"ドラゴンズのここが好き！","placeholder":"例：ドアラと守りの野球"}
]'),

('東京ヤクルトスワローズ', array['スポーツ','野球','NPB'], '[
  {"label":"スワローズファン歴は？","placeholder":"例：古田時代から"},
  {"label":"神宮球場に年何回行く？","placeholder":"例：年12回、ビール飲みながら"},
  {"label":"推し選手は？","placeholder":"例：村上宗隆、塩見泰隆"},
  {"label":"ヤクルトを好きになったきっかけは？","placeholder":"例：神宮の雰囲気に惚れた"},
  {"label":"観戦スタイルは？","placeholder":"例：傘振って七回の攻撃"},
  {"label":"忘れられない場面は？","placeholder":"例：村上の55本塁打、2022日本一"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：ツバメマークのやつ"},
  {"label":"アウェー遠征したことある？","placeholder":"例：甲子園まで行きました"},
  {"label":"スワローズのここが好き！","placeholder":"例：神宮の下町感がたまらない"}
]'),

('広島東洋カープ', array['スポーツ','野球','NPB'], '[
  {"label":"カープファン歴は？","placeholder":"例：生まれながらの赤ヘル"},
  {"label":"マツダスタジアムに年何回行く？","placeholder":"例：年20回、毎週行く"},
  {"label":"推し選手は？","placeholder":"例：菊池涼介、小園海斗"},
  {"label":"カープを好きになったきっかけは？","placeholder":"例：広島出身なので当然"},
  {"label":"観戦スタイルは？","placeholder":"例：声出し応援、カープ女子です"},
  {"label":"忘れられない場面は？","placeholder":"例：2016〜2018の三連覇"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：赤いユニ何枚も持ってる"},
  {"label":"遠征したことある？","placeholder":"例：関西・東京まで追いかけた"},
  {"label":"カープのここが好き！","placeholder":"例：市民球団の一体感"}
]'),

('オリックス・バファローズ', array['スポーツ','野球','NPB'], '[
  {"label":"バファローズファン歴は？","placeholder":"例：合併前のブルーウェーブから"},
  {"label":"京セラ・ほっともっとに年何回行く？","placeholder":"例：年8回"},
  {"label":"推し選手は？","placeholder":"例：頓宮裕真、宮城大弥"},
  {"label":"オリックスを好きになったきっかけは？","placeholder":"例：イチロー時代から"},
  {"label":"観戦スタイルは？","placeholder":"例：大阪・神戸どっちも行く"},
  {"label":"忘れられない場面は？","placeholder":"例：2021〜2023の三連覇"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：青波ユニも持ってる"},
  {"label":"アウェー遠征したことある？","placeholder":"例：メットライフまで行った"},
  {"label":"バファローズのここが好き！","placeholder":"例：関西2球場使う独自スタイル"}
]'),

('福岡ソフトバンクホークス', array['スポーツ','野球','NPB'], '[
  {"label":"ホークスファン歴は？","placeholder":"例：ダイエー時代から"},
  {"label":"みずほPayPayドームに年何回行く？","placeholder":"例：年15回"},
  {"label":"推し選手は？","placeholder":"例：柳田悠岐、甲斐拓也"},
  {"label":"ホークスを好きになったきっかけは？","placeholder":"例：福岡出身なので"},
  {"label":"観戦スタイルは？","placeholder":"例：ドーム外野で声張り上げる派"},
  {"label":"忘れられない場面は？","placeholder":"例：工藤監督時代の黄金期"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：鷹の祭典の限定ユニ"},
  {"label":"アウェー遠征したことある？","placeholder":"例：楽天モバイルまで乗り込んだ"},
  {"label":"ホークスのここが好き！","placeholder":"例：強くてグッズも充実してる"}
]'),

('東北楽天ゴールデンイーグルス', array['スポーツ','野球','NPB'], '[
  {"label":"イーグルスファン歴は？","placeholder":"例：創設初年度から"},
  {"label":"楽天モバイルパークに年何回行く？","placeholder":"例：年10回"},
  {"label":"推し選手は？","placeholder":"例：早川隆久、鈴木大地"},
  {"label":"楽天を好きになったきっかけは？","placeholder":"例：東北出身、地元の球団だから"},
  {"label":"観戦スタイルは？","placeholder":"例：東北の仲間と盛り上がる"},
  {"label":"忘れられない場面は？","placeholder":"例：2013年初優勝・日本一、田中将大24連勝"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：TOHOKUロゴのユニ"},
  {"label":"アウェー遠征したことある？","placeholder":"例：福岡まで遠征した"},
  {"label":"イーグルスのここが好き！","placeholder":"例：東北と一緒に戦う感じ"}
]'),

('千葉ロッテマリーンズ', array['スポーツ','野球','NPB'], '[
  {"label":"マリーンズファン歴は？","placeholder":"例：バレンタイン監督時代から"},
  {"label":"ZOZOマリンに年何回行く？","placeholder":"例：年10回、海風が好き"},
  {"label":"推し選手は？","placeholder":"例：安田尚憲、小島和哉"},
  {"label":"ロッテを好きになったきっかけは？","placeholder":"例：千葉出身なので"},
  {"label":"観戦スタイルは？","placeholder":"例：三塁側で声出し応援"},
  {"label":"忘れられない場面は？","placeholder":"例：2010年日本一、佐々木朗希の完全試合"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：黒ユニが好き"},
  {"label":"アウェー遠征したことある？","placeholder":"例：福岡まで行った"},
  {"label":"マリーンズのここが好き！","placeholder":"例：ZOZOマリンの開放感"}
]'),

('埼玉西武ライオンズ', array['スポーツ','野球','NPB'], '[
  {"label":"ライオンズファン歴は？","placeholder":"例：清原・秋山時代から"},
  {"label":"ベルーナドームに年何回行く？","placeholder":"例：年8回、夏は暑いけど"},
  {"label":"推し選手は？","placeholder":"例：武内夏暉、蛭間拓哉"},
  {"label":"西武を好きになったきっかけは？","placeholder":"例：埼玉出身なので"},
  {"label":"観戦スタイルは？","placeholder":"例：三塁側で元気よく"},
  {"label":"忘れられない場面は？","placeholder":"例：黄金期の清原・秋山・石毛"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：ライオンズブルーのやつ"},
  {"label":"アウェー遠征したことある？","placeholder":"例：楽天まで遠征した"},
  {"label":"ライオンズのここが好き！","placeholder":"例：育成が上手くて若手が楽しみ"}
]'),

('北海道日本ハムファイターズ', array['スポーツ','野球','NPB'], '[
  {"label":"ファイターズファン歴は？","placeholder":"例：北海道移転初年度から"},
  {"label":"エスコンフィールドに年何回行く？","placeholder":"例：年12回、施設が最高"},
  {"label":"推し選手は？","placeholder":"例：万波中正、清宮幸太郎"},
  {"label":"日ハムを好きになったきっかけは？","placeholder":"例：北海道出身なので"},
  {"label":"観戦スタイルは？","placeholder":"例：エスコンの開放感でまったり"},
  {"label":"忘れられない場面は？","placeholder":"例：大谷翔平の二刀流、新庄監督就任"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：新庄ユニ持ってます"},
  {"label":"アウェー遠征したことある？","placeholder":"例：東京ドーム時代も行った"},
  {"label":"ファイターズのここが好き！","placeholder":"例：エスコンフィールドが世界一"}
]');

-- ============================================================
-- [2] スポーツ > サッカー > Jリーグ（15クラブ）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('浦和レッズ', array['スポーツ','サッカー','Jリーグ'], '[
  {"label":"レッズサポ歴は？","placeholder":"例：Jリーグ開幕から"},
  {"label":"埼玉スタジアムに年何回行く？","placeholder":"例：年15回、ゴール裏常連"},
  {"label":"推し選手は？","placeholder":"例：興梠慎三、酒井宏樹"},
  {"label":"浦和を好きになったきっかけは？","placeholder":"例：埼玉出身なので"},
  {"label":"応援スタイルは？","placeholder":"例：ゴール裏で歌いっぱなし"},
  {"label":"忘れられない試合は？","placeholder":"例：ACL優勝、天皇杯の思い出"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：赤いユニ何枚も持ってる"},
  {"label":"アウェー遠征したことある？","placeholder":"例：等々力、日産スタ、全部行く"},
  {"label":"レッズのここが好き！","placeholder":"例：日本最高峰のサポーター文化"}
]'),

('鹿島アントラーズ', array['スポーツ','サッカー','Jリーグ'], '[
  {"label":"アントラーズサポ歴は？","placeholder":"例：Jリーグ初年度から"},
  {"label":"カシマスタジアムに年何回行く？","placeholder":"例：年10回、遠いけど行く"},
  {"label":"推し選手は？","placeholder":"例：鈴木優磨、樋口雄太"},
  {"label":"鹿島を好きになったきっかけは？","placeholder":"例：茨城出身なので"},
  {"label":"応援スタイルは？","placeholder":"例：勝利至上主義のゴール裏"},
  {"label":"忘れられない試合は？","placeholder":"例：リーグ8回優勝の伝統"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：ガラ鹿柄も持ってる"},
  {"label":"アウェー遠征したことある？","placeholder":"例：埼スタにも乗り込んだ"},
  {"label":"アントラーズのここが好き！","placeholder":"例：勝者のメンタリティ"}
]'),

('FC東京', array['スポーツ','サッカー','Jリーグ'], '[
  {"label":"FC東京サポ歴は？","placeholder":"例：東京ガス時代から"},
  {"label":"味の素スタジアムに年何回行く？","placeholder":"例：年12回"},
  {"label":"推し選手は？","placeholder":"例：仲川輝人、荒木遼太郎"},
  {"label":"FC東京を好きになったきっかけは？","placeholder":"例：東京出身なので"},
  {"label":"応援スタイルは？","placeholder":"例：赤青ユニで声張り上げる"},
  {"label":"忘れられない試合は？","placeholder":"例：2020リーグ優勝争い、ルヴァン杯"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：赤と青のやつ"},
  {"label":"アウェー遠征したことある？","placeholder":"例：埼スタ・日産スタ"},
  {"label":"FC東京のここが好き！","placeholder":"例：東京の街クラブという誇り"}
]'),

('川崎フロンターレ', array['スポーツ','サッカー','Jリーグ'], '[
  {"label":"フロンターレサポ歴は？","placeholder":"例：J1昇格の頃から"},
  {"label":"等々力陸上競技場に年何回行く？","placeholder":"例：年15回、アウェーも行く"},
  {"label":"推し選手は？","placeholder":"例：家長昭博、脇坂泰斗"},
  {"label":"川崎を好きになったきっかけは？","placeholder":"例：神奈川出身なので"},
  {"label":"応援スタイルは？","placeholder":"例：等々力のアットホームな雰囲気が好き"},
  {"label":"忘れられない試合は？","placeholder":"例：4年間でのリーグ3連覇"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：水色ユニ何枚も"},
  {"label":"アウェー遠征したことある？","placeholder":"例：鹿島まで遠征した"},
  {"label":"フロンターレのここが好き！","placeholder":"例：地域密着と強さが両立してる"}
]'),

('横浜F・マリノス', array['スポーツ','サッカー','Jリーグ'], '[
  {"label":"マリノスサポ歴は？","placeholder":"例：日産自動車時代から"},
  {"label":"日産スタジアムに年何回行く？","placeholder":"例：年10回"},
  {"label":"推し選手は？","placeholder":"例：アンデルソン・ロペス、水沼宏太"},
  {"label":"マリノスを好きになったきっかけは？","placeholder":"例：横浜出身なので"},
  {"label":"応援スタイルは？","placeholder":"例：バックスタンドでトリコロール旗振る"},
  {"label":"忘れられない試合は？","placeholder":"例：2022・2023リーグ連覇"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：トリコロールのやつ"},
  {"label":"アウェー遠征したことある？","placeholder":"例：等々力ダービーは欠かさない"},
  {"label":"マリノスのここが好き！","placeholder":"例：アタッキングフットボールが最高"}
]'),

('セレッソ大阪', array['スポーツ','サッカー','Jリーグ'], '[
  {"label":"セレッソサポ歴は？","placeholder":"例：森島寛晃の時代から"},
  {"label":"ヨドコウ桜スタジアムに年何回行く？","placeholder":"例：年10回"},
  {"label":"推し選手は？","placeholder":"例：奥埜博亮、田中駿汰"},
  {"label":"セレッソを好きになったきっかけは？","placeholder":"例：大阪出身なので"},
  {"label":"応援スタイルは？","placeholder":"例：サクラ色に染まるゴール裏"},
  {"label":"忘れられない試合は？","placeholder":"例：天皇杯・ルヴァン杯制覇、香川真司在籍時代"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：桜色のユニ"},
  {"label":"アウェー遠征したことある？","placeholder":"例：大阪ダービーはもちろん"},
  {"label":"セレッソのここが好き！","placeholder":"例：桜の花びらとピンクが好き"}
]'),

('ガンバ大阪', array['スポーツ','サッカー','Jリーグ'], '[
  {"label":"ガンバサポ歴は？","placeholder":"例：西野監督の頃から"},
  {"label":"パナソニックスタジアムに年何回行く？","placeholder":"例：年10回"},
  {"label":"推し選手は？","placeholder":"例：宇佐美貴史、東口順昭"},
  {"label":"ガンバを好きになったきっかけは？","placeholder":"例：大阪出身、吹田が地元"},
  {"label":"応援スタイルは？","placeholder":"例：バックで声張り上げる"},
  {"label":"忘れられない試合は？","placeholder":"例：2008ACL・リーグ優勝三冠"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：黒と青のユニ"},
  {"label":"アウェー遠征したことある？","placeholder":"例：大阪ダービーは毎回"},
  {"label":"ガンバのここが好き！","placeholder":"例：スタジアムの雰囲気が熱い"}
]'),

('名古屋グランパス', array['スポーツ','サッカー','Jリーグ'], '[
  {"label":"グランパスサポ歴は？","placeholder":"例：リネカー在籍時代から"},
  {"label":"豊田スタジアムに年何回行く？","placeholder":"例：年8回"},
  {"label":"推し選手は？","placeholder":"例：永井謙佑、稲垣祥"},
  {"label":"名古屋を好きになったきっかけは？","placeholder":"例：愛知出身なので"},
  {"label":"応援スタイルは？","placeholder":"例：赤鯱旗ふって応援"},
  {"label":"忘れられない試合は？","placeholder":"例：2010リーグ優勝、ストイコビッチ監督時代"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：赤と黒のやつ"},
  {"label":"アウェー遠征したことある？","placeholder":"例：埼スタまで遠征した"},
  {"label":"グランパスのここが好き！","placeholder":"例：豊田スタジアムのロケーションが最高"}
]'),

('サンフレッチェ広島', array['スポーツ','サッカー','Jリーグ'], '[
  {"label":"サンフレッチェサポ歴は？","placeholder":"例：三冠達成の頃から"},
  {"label":"エディオンピースウイングに年何回行く？","placeholder":"例：年12回、新スタが好き"},
  {"label":"推し選手は？","placeholder":"例：大橋祐紀、塩谷司"},
  {"label":"広島を好きになったきっかけは？","placeholder":"例：広島出身なので"},
  {"label":"応援スタイルは？","placeholder":"例：紫の旗を振り回す"},
  {"label":"忘れられない試合は？","placeholder":"例：2012・2013・2015リーグ三回優勝"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：紫のストライプユニ"},
  {"label":"アウェー遠征したことある？","placeholder":"例：鹿島まで遠征した"},
  {"label":"サンフレッチェのここが好き！","placeholder":"例：ユース育成が日本一"}
]'),

('ヴィッセル神戸', array['スポーツ','サッカー','Jリーグ'], '[
  {"label":"ヴィッセルサポ歴は？","placeholder":"例：イニエスタ来てから"},
  {"label":"ノエビアスタジアムに年何回行く？","placeholder":"例：年10回、ハーバーランド近くて好き"},
  {"label":"推し選手は？","placeholder":"例：大迫勇也、山口蛍"},
  {"label":"神戸を好きになったきっかけは？","placeholder":"例：兵庫出身なので"},
  {"label":"応援スタイルは？","placeholder":"例：バックスタンドでまったり観戦"},
  {"label":"忘れられない試合は？","placeholder":"例：2023リーグ初優勝、イニエスタ在籍時代"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：黒と赤のユニ"},
  {"label":"アウェー遠征したことある？","placeholder":"例：埼スタ・日産スタ"},
  {"label":"ヴィッセルのここが好き！","placeholder":"例：神戸の港町とクラブのブランド感"}
]'),

('柏レイソル', array['スポーツ','サッカー','Jリーグ'], '[
  {"label":"レイソルサポ歴は？","placeholder":"例：Jリーグ開幕から"},
  {"label":"三協フロンテア柏スタジアムに年何回行く？","placeholder":"例：年10回"},
  {"label":"推し選手は？","placeholder":"例：細谷真大、関根大輝"},
  {"label":"柏を好きになったきっかけは？","placeholder":"例：千葉出身なので"},
  {"label":"応援スタイルは？","placeholder":"例：黄色いユニで熱く応援"},
  {"label":"忘れられない試合は？","placeholder":"例：2011リーグ・ACL制覇、ネルシーニョ監督時代"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：黄色のやつ"},
  {"label":"アウェー遠征したことある？","placeholder":"例：埼スタ・等々力"},
  {"label":"レイソルのここが好き！","placeholder":"例：太陽の塔マークと黄色い一体感"}
]'),

('アルビレックス新潟', array['スポーツ','サッカー','Jリーグ'], '[
  {"label":"アルビサポ歴は？","placeholder":"例：J1昇格の頃から"},
  {"label":"デンカビッグスワンに年何回行く？","placeholder":"例：年10回"},
  {"label":"推し選手は？","placeholder":"例：谷口海斗、小見洋太"},
  {"label":"新潟を好きになったきっかけは？","placeholder":"例：新潟出身なので"},
  {"label":"応援スタイルは？","placeholder":"例：オレンジに染まるビッグスワンが好き"},
  {"label":"忘れられない試合は？","placeholder":"例：2022J2優勝でJ1復帰"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：オレンジのユニ"},
  {"label":"アウェー遠征したことある？","placeholder":"例：埼スタまで行った"},
  {"label":"アルビのここが好き！","placeholder":"例：新潟一丸の温かいサポーター文化"}
]'),

('ジュビロ磐田', array['スポーツ','サッカー','Jリーグ'], '[
  {"label":"ジュビロサポ歴は？","placeholder":"例：黄金期の中山・名波の頃から"},
  {"label":"ヤマハスタジアムに年何回行く？","placeholder":"例：年8回"},
  {"label":"推し選手は？","placeholder":"例：古川陽介、松本昌也"},
  {"label":"磐田を好きになったきっかけは？","placeholder":"例：静岡出身なので"},
  {"label":"応援スタイルは？","placeholder":"例：青いユニで声出し応援"},
  {"label":"忘れられない試合は？","placeholder":"例：ヤマハの黄金期、中山雅史のゴール"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：青白のユニ"},
  {"label":"アウェー遠征したことある？","placeholder":"例：等々力まで行った"},
  {"label":"ジュビロのここが好き！","placeholder":"例：ヤマハ発動機の地域密着感"}
]'),

('北海道コンサドーレ札幌', array['スポーツ','サッカー','Jリーグ'], '[
  {"label":"コンサドーレサポ歴は？","placeholder":"例：北海道移転から"},
  {"label":"札幌ドーム・札幌厚別に年何回行く？","placeholder":"例：年10回"},
  {"label":"推し選手は？","placeholder":"例：小柏剛、田中駿汰"},
  {"label":"コンサドーレを好きになったきっかけは？","placeholder":"例：北海道出身なので"},
  {"label":"応援スタイルは？","placeholder":"例：赤黒ユニで雪でも行く"},
  {"label":"忘れられない試合は？","placeholder":"例：ペトロヴィッチ監督時代のACL挑戦"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：赤黒のユニ"},
  {"label":"アウェー遠征したことある？","placeholder":"例：埼スタまで遠征した"},
  {"label":"コンサドーレのここが好き！","placeholder":"例：北海道の冬でもサッカーを愛する文化"}
]'),

('FC町田ゼルビア', array['スポーツ','サッカー','Jリーグ'], '[
  {"label":"ゼルビアサポ歴は？","placeholder":"例：J1昇格してから"},
  {"label":"町田GIONスタジアムに年何回行く？","placeholder":"例：年8回"},
  {"label":"推し選手は？","placeholder":"例：藤尾翔太、平河悠"},
  {"label":"町田を好きになったきっかけは？","placeholder":"例：町田・相模原出身なので"},
  {"label":"応援スタイルは？","placeholder":"例：青いユニで熱く"},
  {"label":"忘れられない試合は？","placeholder":"例：2023J2優勝でJ1昇格"},
  {"label":"ユニフォームは持ってる？","placeholder":"例：青のユニ持ってます"},
  {"label":"アウェー遠征したことある？","placeholder":"例：埼スタに乗り込んだ"},
  {"label":"ゼルビアのここが好き！","placeholder":"例：上り調子のクラブを応援してる感"}
]');

-- ============================================================
-- [3] スポーツ > サッカー > 欧州（8クラブ）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('アーセナル', array['スポーツ','サッカー','欧州サッカー'], '[
  {"label":"グーナー歴は？","placeholder":"例：ベンゲル監督の頃から"},
  {"label":"エミレーツ・スタジアムに行ったことある？","placeholder":"例：ロンドン遠征で1回"},
  {"label":"推し選手は？","placeholder":"例：サカ、ウーデゴール"},
  {"label":"アーセナルを好きになったきっかけは？","placeholder":"例：ハイライトで見てかっこよかった"},
  {"label":"試合はどこで見る？","placeholder":"例：早起きしてDAZN"},
  {"label":"忘れられない試合は？","placeholder":"例：無敗優勝の49試合、2023-24シーズンの優勝争い"},
  {"label":"グッズは持ってる？","placeholder":"例：赤いユニフォーム"},
  {"label":"アーセナルのここが好き！","placeholder":"例：美しいパスサッカーと若手育成"}
]'),

('リバプール', array['スポーツ','サッカー','欧州サッカー'], '[
  {"label":"コップ歴は？","placeholder":"例：スティーブン・ジェラードの頃から"},
  {"label":"アンフィールドに行ったことある？","placeholder":"例：夢の聖地巡礼で1回"},
  {"label":"推し選手は？","placeholder":"例：サラー、アーノルド"},
  {"label":"リバプールを好きになったきっかけは？","placeholder":"例：YNWAを聞いて震えた"},
  {"label":"試合はどこで見る？","placeholder":"例：深夜でもDAZNで見る"},
  {"label":"忘れられない試合は？","placeholder":"例：2019CL優勝、バルサ相手の奇跡の逆転"},
  {"label":"グッズは持ってる？","placeholder":"例：赤いユニ、YNWAタオル"},
  {"label":"リバプールのここが好き！","placeholder":"例：YNWAとコップの雰囲気が世界一"}
]'),

('マンチェスター・シティ', array['スポーツ','サッカー','欧州サッカー'], '[
  {"label":"シティサポ歴は？","placeholder":"例：グアルディオラ就任から"},
  {"label":"エティハド・スタジアムに行ったことある？","placeholder":"例：マンチェスター遠征で行った"},
  {"label":"推し選手は？","placeholder":"例：ハーランド、デ・ブライネ"},
  {"label":"シティを好きになったきっかけは？","placeholder":"例：グアルディオラのサッカーに魅了された"},
  {"label":"試合はどこで見る？","placeholder":"例：DAZNで毎試合"},
  {"label":"忘れられない試合は？","placeholder":"例：2023三冠達成"},
  {"label":"グッズは持ってる？","placeholder":"例：水色のユニ"},
  {"label":"シティのここが好き！","placeholder":"例：グアルディオラの戦術が芸術的"}
]'),

('チェルシー', array['スポーツ','サッカー','欧州サッカー'], '[
  {"label":"チェルシーサポ歴は？","placeholder":"例：アブラモビッチ買収の頃から"},
  {"label":"スタンフォード・ブリッジに行ったことある？","placeholder":"例：ロンドン遠征で"},
  {"label":"推し選手は？","placeholder":"例：パーマー、ジャクソン"},
  {"label":"チェルシーを好きになったきっかけは？","placeholder":"例：CL優勝の瞬間を見て"},
  {"label":"試合はどこで見る？","placeholder":"例：DAZNで見てる"},
  {"label":"忘れられない試合は？","placeholder":"例：2012CL優勝（バイエルン戦PK）"},
  {"label":"グッズは持ってる？","placeholder":"例：青いユニ"},
  {"label":"チェルシーのここが好き！","placeholder":"例：ビッグクラブの風格"}
]'),

('マンチェスター・ユナイテッド', array['スポーツ','サッカー','欧州サッカー'], '[
  {"label":"マンU サポ歴は？","placeholder":"例：ベッカム在籍時代から"},
  {"label":"オールド・トラッフォードに行ったことある？","placeholder":"例：夢のシアター・オブ・ドリームスへ"},
  {"label":"推し選手は？","placeholder":"例：ラッシュフォード、ブルーノ"},
  {"label":"マンUを好きになったきっかけは？","placeholder":"例：ファーガソン卿の時代"},
  {"label":"試合はどこで見る？","placeholder":"例：深夜にDAZN"},
  {"label":"忘れられない試合は？","placeholder":"例：1999三冠、ファーガソン監督時代の黄金期"},
  {"label":"グッズは持ってる？","placeholder":"例：赤いユニ、スカーフ"},
  {"label":"マンUのここが好き！","placeholder":"例：ファーガソン卿が作った伝統と格式"}
]'),

('レアル・マドリード', array['スポーツ','サッカー','欧州サッカー'], '[
  {"label":"マドリディスタ歴は？","placeholder":"例：ロナウド9番時代から"},
  {"label":"サンティアゴ・ベルナベウに行ったことある？","placeholder":"例：マドリード遠征で行った"},
  {"label":"推し選手は？","placeholder":"例：ヴィニシウス、ベリンガム"},
  {"label":"レアルを好きになったきっかけは？","placeholder":"例：銀河系軍団の時代"},
  {"label":"試合はどこで見る？","placeholder":"例：深夜でも見る"},
  {"label":"忘れられない試合は？","placeholder":"例：CL14回目優勝、ロナウド・ベイル時代"},
  {"label":"グッズは持ってる？","placeholder":"例：白いユニフォーム"},
  {"label":"レアルのここが好き！","placeholder":"例：銀河系クラブの圧倒的な格"}
]'),

('FCバルセロナ', array['スポーツ','サッカー','欧州サッカー'], '[
  {"label":"クレ歴は？","placeholder":"例：ロナウジーニョ時代から"},
  {"label":"カンプ・ノウに行ったことある？","placeholder":"例：バルセロナ旅行で行った"},
  {"label":"推し選手は？","placeholder":"例：ヤマル、レヴァンドフスキ"},
  {"label":"バルサを好きになったきっかけは？","placeholder":"例：シャビ・イニエスタのパスに魅了された"},
  {"label":"試合はどこで見る？","placeholder":"例：DAZNで見てる"},
  {"label":"忘れられない試合は？","placeholder":"例：メッシ時代の無敵艦隊、2009三冠"},
  {"label":"グッズは持ってる？","placeholder":"例：ブルーとガーネット"},
  {"label":"バルサのここが好き！","placeholder":"例：カンテラ出身選手と美しいサッカー"}
]'),

('バイエルン・ミュンヘン', array['スポーツ','サッカー','欧州サッカー'], '[
  {"label":"バイエルンサポ歴は？","placeholder":"例：クリンスマン時代から"},
  {"label":"アリアンツ・アレーナに行ったことある？","placeholder":"例：ミュンヘン旅行で"},
  {"label":"推し選手は？","placeholder":"例：ケイン、ノイアー"},
  {"label":"バイエルンを好きになったきっかけは？","placeholder":"例：ブンデスの王者の貫禄"},
  {"label":"試合はどこで見る？","placeholder":"例：DAZNで見てる"},
  {"label":"忘れられない試合は？","placeholder":"例：2020年三冠達成、ロッベン＆リベリ時代"},
  {"label":"グッズは持ってる？","placeholder":"例：赤いユニ"},
  {"label":"バイエルンのここが好き！","placeholder":"例：ブンデスリーガの絶対王者の風格"}
]');

-- ============================================================
-- [4] スポーツ > その他（10）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('侍ジャパン（野球日本代表）', array['スポーツ','その他'], '[
  {"label":"侍ジャパンを応援し始めたのは？","placeholder":"例：2006年第1回WBCから"},
  {"label":"WBC・国際大会は現地観戦したことある？","placeholder":"例：2023WBC東京ドームに行った"},
  {"label":"歴代で一番好きな選手は？","placeholder":"例：イチロー、大谷翔平"},
  {"label":"印象に残った試合は？","placeholder":"例：2023WBC準決勝メキシコ戦"},
  {"label":"大谷翔平についてひとこと","placeholder":"例：宇宙人すぎてもはや言葉がない"},
  {"label":"好きなポジション・役割は？","placeholder":"例：クローザーが好き"},
  {"label":"次回大会への期待は？","placeholder":"例：2026WBCも絶対優勝してほしい"}
]'),

('サッカー日本代表', array['スポーツ','その他'], '[
  {"label":"日本代表を応援し始めたのは？","placeholder":"例：1998年フランスW杯から"},
  {"label":"W杯・アジア杯は現地または現地応援したことある？","placeholder":"例：2022カタールW杯をパブリックビューで"},
  {"label":"歴代で一番好きな選手は？","placeholder":"例：中田英寿、三笘薫"},
  {"label":"忘れられない試合は？","placeholder":"例：2022カタールW杯ドイツ・スペイン撃破"},
  {"label":"三笘の1ミリについてひとこと","placeholder":"例：あの瞬間は泣いた"},
  {"label":"今後の日本代表に期待することは？","placeholder":"例：W杯ベスト8以上"},
  {"label":"好きなポジション・戦術は？","placeholder":"例：ハイプレスのやつ"}
]'),

('フィギュアスケート', array['スポーツ','その他'], '[
  {"label":"フィギュアを見始めたのは？","placeholder":"例：荒川静香の金メダルから"},
  {"label":"アイスショーや大会に行ったことある？","placeholder":"例：NHK杯に行った"},
  {"label":"推しスケーターは？","placeholder":"例：坂本花織、鍵山優真"},
  {"label":"好きになったきっかけは？","placeholder":"例：羽生結弦の演技に泣いた"},
  {"label":"フィギュアのどこが好き？","placeholder":"例：音楽と演技の融合"},
  {"label":"忘れられない演技は？","placeholder":"例：羽生の「SEIMEI」、伊藤みどりのトリプルアクセル"},
  {"label":"現地観戦の魅力は？","placeholder":"例：ジャンプの迫力が全然違う"}
]'),

('競馬', array['スポーツ','その他'], '[
  {"label":"競馬を始めたのは？","placeholder":"例：ディープインパクト時代から"},
  {"label":"競馬場に年何回行く？","placeholder":"例：年5回、東京競馬場メイン"},
  {"label":"歴代で一番好きな馬は？","placeholder":"例：ディープインパクト、オルフェーヴル"},
  {"label":"現在推してる馬は？","placeholder":"例：まだ内緒"},
  {"label":"好きなレースは？","placeholder":"例：日本ダービー、有馬記念"},
  {"label":"競馬の楽しみ方は？","placeholder":"例：馬券より馬が好きで見てる"},
  {"label":"競馬のここが好き！","placeholder":"例：血統ロマンとドラマ性"}
]'),

('Bリーグ好き', array['スポーツ','その他'], '[
  {"label":"Bリーグを見始めたのは？","placeholder":"例：開幕シーズンから"},
  {"label":"推しクラブは？","placeholder":"例：宇都宮ブレックス、琉球ゴールデンキングス"},
  {"label":"推し選手は？","placeholder":"例：河村勇輝、比江島慎"},
  {"label":"アリーナ観戦したことある？","placeholder":"例：有明アリーナに行った"},
  {"label":"Bリーグを好きになったきっかけは？","placeholder":"例：八村塁・渡邊雄太のNBA挑戦から"},
  {"label":"NBAと比べてBリーグのいいところは？","placeholder":"例：アリーナが近くて選手の顔が見える"},
  {"label":"日本代表への期待は？","placeholder":"例：パリ五輪の快進撃で火がついた"}
]'),

('NBA好き', array['スポーツ','その他'], '[
  {"label":"NBAを見始めたのは？","placeholder":"例：マイケル・ジョーダン時代から"},
  {"label":"推しチームは？","placeholder":"例：LAレイカーズ、ゴールデンステート"},
  {"label":"推し選手は？","placeholder":"例：ルカ・ドンチッチ、ヤニス"},
  {"label":"試合はどこで見る？","placeholder":"例：NBA League Pass、深夜に見る"},
  {"label":"NBAを好きになったきっかけは？","placeholder":"例：スラムダンクでバスケにハマって"},
  {"label":"忘れられない試合・場面は？","placeholder":"例：ジョーダンのファイナルショット"},
  {"label":"NBAのここが好き！","placeholder":"例：選手のキャラクターとドラマ性"}
]'),

('将棋好き', array['スポーツ','その他'], '[
  {"label":"将棋を始めたのは？","placeholder":"例：祖父に教えてもらって"},
  {"label":"棋力は？","placeholder":"例：将棋ウォーズ2級、観る将です"},
  {"label":"推し棋士は？","placeholder":"例：藤井聡太、羽生善治"},
  {"label":"将棋を好きになったきっかけは？","placeholder":"例：3月のライオンを読んで"},
  {"label":"タイトル戦の観戦はする？","placeholder":"例：AbemaTVで必ず見る"},
  {"label":"将棋のここが好き！","placeholder":"例：終盤の逆転劇とドラマ性"}
]'),

('藤井聡太', array['スポーツ','その他'], '[
  {"label":"藤井聡太を追い始めたのは？","placeholder":"例：14歳でのデビュー29連勝から"},
  {"label":"藤井さんのどこが好き？","placeholder":"例：盤面への集中力と礼儀正しさ"},
  {"label":"印象に残った対局は？","placeholder":"例：八冠達成の対局"},
  {"label":"AIを超える手を見た瞬間は？","placeholder":"例：名人戦の△8五飛"},
  {"label":"将棋の棋力は？","placeholder":"例：観る将専門、指せません"},
  {"label":"藤井さんに一言","placeholder":"例：永遠に応援します"},
  {"label":"次に期待することは？","placeholder":"例：タイトル全冠防衛"}
]'),

('RIZIN・格闘技', array['スポーツ','その他'], '[
  {"label":"格闘技を見始めたのは？","placeholder":"例：PRIDE時代から"},
  {"label":"RIZINはどこで見る？","placeholder":"例：Amazonプライムビデオ、たまに現地"},
  {"label":"推しファイターは？","placeholder":"例：朝倉未来、平本蓮"},
  {"label":"格闘技を好きになったきっかけは？","placeholder":"例：朝倉未来のYouTubeから"},
  {"label":"忘れられない試合は？","placeholder":"例：那須川天心vs武尊"},
  {"label":"好きなルール・団体は？","placeholder":"例：MMA、K-1、ボクシング"},
  {"label":"格闘技のここが好き！","placeholder":"例：一発逆転のドラマと男のロマン"}
]'),

('新日本プロレス', array['スポーツ','その他'], '[
  {"label":"新日本のファン歴は？","placeholder":"例：猪木・長州時代から"},
  {"label":"両国・武道館など会場に年何回行く？","placeholder":"例：年5回、G1は必ず"},
  {"label":"推しレスラーは？","placeholder":"例：棚橋弘至、内藤哲也"},
  {"label":"新日本を好きになったきっかけは？","placeholder":"例：棚橋の「100年に一人の逸材」"},
  {"label":"忘れられない試合は？","placeholder":"例：オカダ・カズチカvs棚橋の東京ドーム"},
  {"label":"好きな派閥・ユニットは？","placeholder":"例：ロス・インゴベルナブレス・デ・ハポン"},
  {"label":"新日本のここが好き！","placeholder":"例：東京ドームのメインイベントの熱量"}
]');

-- ============================================================
-- [5] 音楽・アイドル > STARTO系（10グループ）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('SnowMan', array['音楽・アイドル','STARTO'], '[
  {"label":"スノ担歴は？","placeholder":"例：少クラで見てから沼落ち"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年4回、ドームも行く"},
  {"label":"推しメンは？","placeholder":"例：目黒蓮、ラウール"},
  {"label":"SnowManのここが好き！","placeholder":"例：9人のバランスと仲の良さ"},
  {"label":"好きな曲は？","placeholder":"例：「HELLO HELLO」「ブラザービート」"},
  {"label":"バラエティとパフォーマンス、どっちのSnowManが好き？","placeholder":"例：両方好きだけどバラエティが神"},
  {"label":"グッズ収集は？","placeholder":"例：うちわとフォトブックは全部"},
  {"label":"ドラマ・映画・舞台は追ってる？","placeholder":"例：目黒蓮の作品は全部見てる"},
  {"label":"担降りしそうになったことある？","placeholder":"例：絶対ない、一生スノ担"},
  {"label":"新規スノ担に一言","placeholder":"例：ラウールのダンスから見てください"}
]'),

('SixTONES', array['音楽・アイドル','STARTO'], '[
  {"label":"ストーン歴は？","placeholder":"例：デビュー前から追ってた"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年3回"},
  {"label":"推しメンは？","placeholder":"例：京本大我、松村北斗"},
  {"label":"SixTONESのここが好き！","placeholder":"例：6人の音楽へのこだわりと個性"},
  {"label":"好きな曲は？","placeholder":"例：「Imitation Rain」「WHIP THAT」"},
  {"label":"SixTONESの音楽性をひとことで言うと？","placeholder":"例：ジャニーズらしくない本格的なロック"},
  {"label":"YouTubeはチェックしてる？","placeholder":"例：新着は全部見てる"},
  {"label":"ドラマ・映画は追ってる？","placeholder":"例：松村北斗の演技が好きで"},
  {"label":"グッズは？","placeholder":"例：ロゴ入りのやつを集めてる"},
  {"label":"新規ストーンに一言","placeholder":"例：「Imitation Rain」から聴いてください"}
]'),

('なにわ男子', array['音楽・アイドル','STARTO'], '[
  {"label":"なにわ担歴は？","placeholder":"例：デビュー前の関西Jr時代から"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年3回"},
  {"label":"推しメンは？","placeholder":"例：道枝駿佑、西畑大吾"},
  {"label":"なにわ男子のここが好き！","placeholder":"例：関西のノリと明るさ、全員仲良し感"},
  {"label":"好きな曲は？","placeholder":"例：「初心LOVE」「The Answer」"},
  {"label":"バラエティ力はどう思う？","placeholder":"例：関西芸人並みで最高"},
  {"label":"グッズは？","placeholder":"例：うちわと写真を集めてる"},
  {"label":"ドラマは追ってる？","placeholder":"例：道枝くんの出演作は必ず見る"},
  {"label":"なにわ男子の魅力を新規に伝えるとしたら？","placeholder":"例：まずライブ映像から見てほしい"}
]'),

('Travis Japan', array['音楽・アイドル','STARTO'], '[
  {"label":"トラジャ担歴は？","placeholder":"例：アメリカ留学前から追ってた"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年2〜3回"},
  {"label":"推しメンは？","placeholder":"例：中村海人、松倉海斗"},
  {"label":"Travis Japanのここが好き！","placeholder":"例：ダンスレベルが圧倒的に高い"},
  {"label":"好きな曲は？","placeholder":"例：「JUST DANCE!」「Candy Kiss」"},
  {"label":"海外での活動についてどう思う？","placeholder":"例：グローバル展開が頼もしい"},
  {"label":"グッズは？","placeholder":"例：ライブグッズを集めてる"},
  {"label":"トラジャの魅力をひとことで","placeholder":"例：ダンスを見るだけで価値がある"}
]'),

('King & Prince', array['音楽・アイドル','STARTO'], '[
  {"label":"キンプリ担歴は？","placeholder":"例：デビューシングルから"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年3回"},
  {"label":"推しメンは？","placeholder":"例：永瀬廉、髙橋海人、岸優太"},
  {"label":"3人体制になってどう？","placeholder":"例：3人の絆がより深まった気がする"},
  {"label":"好きな曲は？","placeholder":"例：「Produced」「恋降る月夜に君想ふ」"},
  {"label":"グッズは？","placeholder":"例：ピンクのやつを中心に"},
  {"label":"ドラマ・映画は追ってる？","placeholder":"例：永瀬廉の演技が好き"},
  {"label":"キンプリのここが好き！","placeholder":"例：正統派アイドルの王道感"}
]'),

('関ジャニ∞（SUPER EIGHT）', array['音楽・アイドル','STARTO'], '[
  {"label":"エイター歴は？","placeholder":"例：関ジャムで好きになった"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年2〜3回"},
  {"label":"推しメンは？","placeholder":"例：横山裕、丸山隆平"},
  {"label":"関ジャニ∞のここが好き！","placeholder":"例：バンドとしての実力と関西のノリ"},
  {"label":"好きな曲は？","placeholder":"例：「ズッコケ男道」「eighterness」"},
  {"label":"関ジャムは見てる？","placeholder":"例：毎週録画して見てる"},
  {"label":"グッズは？","placeholder":"例：バンドTシャツを集めてる"},
  {"label":"長年追い続けてきた感想を一言","placeholder":"例：変わらない関西魂が好き"}
]'),

('嵐', array['音楽・アイドル','STARTO'], '[
  {"label":"嵐担歴は？","placeholder":"例：デビューから20年以上"},
  {"label":"活動休止前、コンサートに何回行った？","placeholder":"例：国立競技場に3回行けた"},
  {"label":"推しメンは？","placeholder":"例：二宮和也、相葉雅紀"},
  {"label":"嵐のここが好き！","placeholder":"例：5人の仲の良さと20年の歴史"},
  {"label":"好きな曲は？","placeholder":"例：「A・RA・SHI」「Happiness」「Love so sweet」"},
  {"label":"活動再開を信じてる？","placeholder":"例：絶対に信じて待ってる"},
  {"label":"5人それぞれの個人活動は追ってる？","placeholder":"例：二宮さんの映画は全部見てる"},
  {"label":"嵐との思い出を一つ","placeholder":"例：紅白の「誰も知らない」で泣いた"}
]'),

('Hey! Say! JUMP', array['音楽・アイドル','STARTO'], '[
  {"label":"ジャンプ担歴は？","placeholder":"例：デビューシングルから"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年3回"},
  {"label":"推しメンは？","placeholder":"例：山田涼介、知念侑李"},
  {"label":"Hey! Say! JUMPのここが好き！","placeholder":"例：デビューから変わらない仲の良さ"},
  {"label":"好きな曲は？","placeholder":"例：「Ultra Music Power」「週刊うわさのカップル」"},
  {"label":"グッズは？","placeholder":"例：うちわとペンライト"},
  {"label":"ドラマ・映画は追ってる？","placeholder":"例：山田涼介の作品は全部"},
  {"label":"ジャンプの魅力を一言","placeholder":"例：長年続く安定感と進化"}
]'),

('Kis-My-Ft2', array['音楽・アイドル','STARTO'], '[
  {"label":"キスマイ担歴は？","placeholder":"例：デビュー前のジュニア時代から"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年2〜3回"},
  {"label":"推しメンは？","placeholder":"例：藤ヶ谷太輔、玉森裕太"},
  {"label":"キスマイのここが好き！","placeholder":"例：ローラースケートとバラエティ力"},
  {"label":"好きな曲は？","placeholder":"例：「Everybody Go」「SHE!HER!HER!」"},
  {"label":"バラエティは追ってる？","placeholder":"例：キスブサは毎週"},
  {"label":"グッズは？","placeholder":"例：ツアーグッズを毎回買う"},
  {"label":"キスマイの魅力を新規に伝えるとしたら？","placeholder":"例：バラエティから入ると好きになれる"}
]'),

('A.B.C-Z', array['音楽・アイドル','STARTO'], '[
  {"label":"えびてぃ担歴は？","placeholder":"例：ジャニーズJr.時代から"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年2回"},
  {"label":"推しメンは？","placeholder":"例：橋本良亮、戸塚祥太"},
  {"label":"A.B.C-Zのここが好き！","placeholder":"例：アクロバットと本格的なパフォーマンス"},
  {"label":"好きな曲は？","placeholder":"例：「Veteran」「Queen of Spades」"},
  {"label":"長年のファンとして一言","placeholder":"例：やっと世間に認知されてきた"},
  {"label":"グッズは？","placeholder":"例：アクロバットDVDを全部持ってる"},
  {"label":"えびてぃの魅力を一言","placeholder":"例：技術力と絆の深さが圧倒的"}
]');

-- ============================================================
-- [6] 音楽・アイドル > 国内男性（非STARTO）（7グループ）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('BE:FIRST', array['音楽・アイドル','国内アイドル（男性）'], '[
  {"label":"BESTie歴は？","placeholder":"例：THE FIRST から見てた"},
  {"label":"ライブに年何回行く？","placeholder":"例：年3回、アリーナも行く"},
  {"label":"推しメンは？","placeholder":"例：RYUHEI、SHUNTO"},
  {"label":"BE:FIRSTのここが好き！","placeholder":"例：歌・ダンス・ラップ全部できる"},
  {"label":"好きな曲は？","placeholder":"例：「Gifted.」「Mainstream」"},
  {"label":"THE FIRSTを見てた？","placeholder":"例：全話リアタイして全力投票した"},
  {"label":"グローバル展開への期待は？","placeholder":"例：世界に行ってほしい"},
  {"label":"BE:FIRSTの魅力を一言","placeholder":"例：日本のボーイズグループの新時代"}
]'),

('JO1', array['音楽・アイドル','国内アイドル（男性）'], '[
  {"label":"JAM歴は？","placeholder":"例：PRODUCE 101 JAPANから"},
  {"label":"ライブに年何回行く？","placeholder":"例：年3回"},
  {"label":"推しメンは？","placeholder":"例：川尻蓮、與那城奨"},
  {"label":"JO1のここが好き！","placeholder":"例：11人の個性とチームワーク"},
  {"label":"好きな曲は？","placeholder":"例：「REAL」「Shine A Light」"},
  {"label":"PRODUCE 101 JAPAN当時の推しは？","placeholder":"例：ずっと川尻蓮を推してた"},
  {"label":"グッズは？","placeholder":"例：ペンライトと缶バッジ"},
  {"label":"JO1の魅力を一言","placeholder":"例：ファンと一緒に成長してる感"}
]'),

('INI', array['音楽・アイドル','国内アイドル（男性）'], '[
  {"label":"M歴は？","placeholder":"例：PRODUCE 101 JAPAN SEASON2から"},
  {"label":"ライブに年何回行く？","placeholder":"例：年3回"},
  {"label":"推しメンは？","placeholder":"例：藤牧京介、後藤威尊"},
  {"label":"INIのここが好き！","placeholder":"例：11人それぞれの個性が強い"},
  {"label":"好きな曲は？","placeholder":"例：「Rocketeer」「DROP」"},
  {"label":"プデュ当時の推しは？","placeholder":"例：ずっと推してた"},
  {"label":"グッズは？","placeholder":"例：ライブグッズを集めてる"},
  {"label":"INIの魅力を一言","placeholder":"例：パフォーマンスのレベルが高い"}
]'),

('Da-iCE', array['音楽・アイドル','国内アイドル（男性）'], '[
  {"label":"Da-iCEのファン歴は？","placeholder":"例：「CITRUS」で知って"},
  {"label":"ライブに年何回行く？","placeholder":"例：年2〜3回"},
  {"label":"推しメンは？","placeholder":"例：花村想太、工藤大輝"},
  {"label":"Da-iCEのここが好き！","placeholder":"例：ダンスと歌の実力、大人の色気"},
  {"label":"好きな曲は？","placeholder":"例：「CITRUS」「スターマイン」「I wonder」"},
  {"label":"最近の曲と昔の曲、どっちが好き？","placeholder":"例：どっちも好きだけど最近の方が好き"},
  {"label":"グッズは？","placeholder":"例：ライブTシャツを集めてる"},
  {"label":"Da-iCEの魅力を一言","placeholder":"例：実力派なのにキャラも面白い"}
]'),

('三代目 J SOUL BROTHERS', array['音楽・アイドル','国内アイドル（男性）'], '[
  {"label":"三代目ファン歴は？","placeholder":"例：「R.Y.U.S.E.I.」から"},
  {"label":"ライブに年何回行く？","placeholder":"例：年2回、ドームも行く"},
  {"label":"推しメンは？","placeholder":"例：登坂広臣、今市隆二"},
  {"label":"三代目のここが好き！","placeholder":"例：圧倒的なステージと曲の完成度"},
  {"label":"好きな曲は？","placeholder":"例：「R.Y.U.S.E.I.」「Unfair World」"},
  {"label":"EXILEとの違いをどう思う？","placeholder":"例：三代目は音楽性がより洗練されてる"},
  {"label":"グッズは？","placeholder":"例：ライブグッズを毎回"},
  {"label":"三代目の魅力を一言","placeholder":"例：ドームを揺らすスケール感"}
]'),

('THE RAMPAGE', array['音楽・アイドル','国内アイドル（男性）'], '[
  {"label":"THE RAMPAGEファン歴は？","placeholder":"例：デビューから"},
  {"label":"ライブに年何回行く？","placeholder":"例：年2〜3回"},
  {"label":"推しメンは？","placeholder":"例：川村壱馬、吉野北人"},
  {"label":"THE RAMPAGEのここが好き！","placeholder":"例：16人のダンスパフォーマンスの迫力"},
  {"label":"好きな曲は？","placeholder":"例：「SWAG & PRIDE」「INVISIBLE LOVE」"},
  {"label":"LDH系グループでここが一番な理由は？","placeholder":"例：16人の編成と熱量が好き"},
  {"label":"グッズは？","placeholder":"例：ライブグッズを集めてる"},
  {"label":"THE RAMPAGEの魅力を一言","placeholder":"例：16人の熱量が画面越しでも伝わる"}
]'),

('EXILE TRIBE', array['音楽・アイドル','国内アイドル（男性）'], '[
  {"label":"EXILE好き歴は？","placeholder":"例：初代EXILEから"},
  {"label":"ライブに年何回行く？","placeholder":"例：年2〜3回"},
  {"label":"特に好きなグループは？","placeholder":"例：三代目JSB、THE RAMPAGE、GENERATIONS"},
  {"label":"EXILEのここが好き！","placeholder":"例：LDHのパフォーマンスへのこだわり"},
  {"label":"好きな曲は？","placeholder":"例：「Choo Choo TRAIN」「EXILE PRIDE」"},
  {"label":"好きなメンバーは？","placeholder":"例：EXILE ATSUSHIのボーカルが好き"},
  {"label":"EXILE TRIBEの魅力を一言","placeholder":"例：日本のダンス&ボーカルグループの頂点"}
]');

-- ============================================================
-- [7] 音楽・アイドル > 坂道・48（5グループ）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('乃木坂46', array['音楽・アイドル','坂道・48'], '[
  {"label":"乃木オタ歴は？","placeholder":"例：生駒里奈の頃から"},
  {"label":"握手会・ライブに年何回行く？","placeholder":"例：年5回"},
  {"label":"推しメンは？（現役・OG問わず）","placeholder":"例：山下美月、白石麻衣"},
  {"label":"乃木坂のここが好き！","placeholder":"例：清楚なイメージと高い総合力"},
  {"label":"好きな曲は？","placeholder":"例：「インフルエンサー」「シンクロニシティ」"},
  {"label":"推し曲のフォーメーションは記憶してる？","placeholder":"例：センター位置は全部覚えてる"},
  {"label":"グッズ・生写真は集めてる？","placeholder":"例：推しの生写真は全コンプ"},
  {"label":"卒業メンへの思いは？","placeholder":"例：今でも応援してる"}
]'),

('櫻坂46', array['音楽・アイドル','坂道・48'], '[
  {"label":"さくオタ歴は？","placeholder":"例：欅坂46時代から"},
  {"label":"ライブに年何回行く？","placeholder":"例：年4回、東京ドームも"},
  {"label":"推しメンは？","placeholder":"例：森田ひかる、山﨑天"},
  {"label":"櫻坂のここが好き！","placeholder":"例：欅の魂を引き継いだ強さと進化"},
  {"label":"好きな曲は？","placeholder":"例：「BAN」「Start over!」"},
  {"label":"欅坂から推してた？","placeholder":"例：欅からずっと、改名後も変わらず"},
  {"label":"グッズ・生写真は？","placeholder":"例：推しの生写真は全部買う"},
  {"label":"平手友梨奈についてどう思う？","placeholder":"例：今でも唯一無二の存在だと思ってる"}
]'),

('日向坂46', array['音楽・アイドル','坂道・48'], '[
  {"label":"おひさま歴は？","placeholder":"例：けやき坂時代から"},
  {"label":"ライブに年何回行く？","placeholder":"例：年4回"},
  {"label":"推しメンは？","placeholder":"例：小坂菜緒、加藤史帆"},
  {"label":"日向坂のここが好き！","placeholder":"例：ひたむきな努力と明るいキャラ"},
  {"label":"好きな曲は？","placeholder":"例：「キュン」「ってか」「ゴルフボール」"},
  {"label":"3期生以降の好きなメンバーは？","placeholder":"例：山口陽世が好き"},
  {"label":"グッズ・生写真は？","placeholder":"例：推しの分は全部集めてる"},
  {"label":"けやき坂時代を知ってる？","placeholder":"例：ひらがなけやきから追ってた"}
]'),

('AKB48', array['音楽・アイドル','坂道・48'], '[
  {"label":"AKBを推し始めたのは？","placeholder":"例：前田敦子の頃から"},
  {"label":"劇場公演・握手会は行ったことある？","placeholder":"例：秋葉原の劇場に10回以上"},
  {"label":"推しメンは？（現役・OG問わず）","placeholder":"例：前田敦子、指原莉乃"},
  {"label":"AKBのここが好き！","placeholder":"例：総選挙のドラマと劇場文化"},
  {"label":"好きな曲は？","placeholder":"例：「ヘビーローテーション」「恋するフォーチュンクッキー」"},
  {"label":"推し曲・選抜の歴史は追ってた？","placeholder":"例：総選挙は全部見てた"},
  {"label":"グッズは？","placeholder":"例：生写真を大量に持ってる"},
  {"label":"AKBの全盛期を語るなら？","placeholder":"例：第5〜7回選挙が一番熱かった"}
]'),

('SKE48', array['音楽・アイドル','坂道・48'], '[
  {"label":"SKEを推し始めたのは？","placeholder":"例：松井玲奈の頃から"},
  {"label":"名古屋・SKE劇場には行ったことある？","placeholder":"例：栄の劇場に何度も"},
  {"label":"推しメンは？（現役・OG問わず）","placeholder":"例：松井玲奈、松井珠理奈"},
  {"label":"SKEのここが好き！","placeholder":"例：名古屋愛と劇場公演への情熱"},
  {"label":"好きな曲は？","placeholder":"例：「片想いFinally」「無意識の色」"},
  {"label":"AKBグループの中でSKEを選ぶ理由は？","placeholder":"例：劇場公演の熱量が一番"},
  {"label":"グッズは？","placeholder":"例：推しの生写真を集めてる"},
  {"label":"SKEの未来についてひとこと","placeholder":"例：名古屋発でもっと大きくなれる"}
]');

-- ============================================================
-- [8] 音楽・アイドル > ハロープロ / その他国内女性
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('モーニング娘。', array['音楽・アイドル','ハロープロ'], '[
  {"label":"モー娘。ファン歴は？","placeholder":"例：LOVEマシーン時代から"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年3回、武道館も"},
  {"label":"推しメンは？（歴代含む）","placeholder":"例：後藤真希、譜久村聖"},
  {"label":"モー娘。のここが好き！","placeholder":"例：何十年続く歴史と伝統、ハロコン"},
  {"label":"好きな曲は？","placeholder":"例：「LOVEマシーン」「恋愛レボリューション21」"},
  {"label":"ハロコンは毎回行く？","placeholder":"例：夏冬欠かさず行く"},
  {"label":"グッズは？","placeholder":"例：推しメンのフォトブックを集めてる"},
  {"label":"加入〜卒業のドラマで印象的なのは？","placeholder":"例：後藤真希の卒業が一番泣いた"}
]'),

('でんぱ組.inc', array['音楽・アイドル','その他国内女性'], '[
  {"label":"でんぱ組ファン歴は？","placeholder":"例：「でんでんぱっしょん」から"},
  {"label":"ライブに年何回行く？","placeholder":"例：年3回"},
  {"label":"推しメンは？","placeholder":"例：夢眠ねむ（OG）、古川未鈴"},
  {"label":"でんぱ組のここが好き！","placeholder":"例：電波系カルチャーとオタク愛"},
  {"label":"好きな曲は？","placeholder":"例：「でんでんぱっしょん」「W.W.D」"},
  {"label":"オタク系コンテンツへの愛着は？","placeholder":"例：アニメ・ゲーム・声優全部好き"},
  {"label":"でんぱ組の魅力を一言","placeholder":"例：オタクが作ったオタクのためのアイドル"}
]'),

('≠ME', array['音楽・アイドル','その他国内女性'], '[
  {"label":"ノイミー担歴は？","placeholder":"例：オーディションから追ってた"},
  {"label":"ライブに年何回行く？","placeholder":"例：年3〜4回"},
  {"label":"推しメンは？","placeholder":"例：オオタニナナセ、和田桜子"},
  {"label":"≠MEのここが好き！","placeholder":"例：指原莉乃Pのプロデュース力と個性派揃い"},
  {"label":"好きな曲は？","placeholder":"例：「=LOVE」との違い、「手遅れcaution」"},
  {"label":"=LOVEとの違いは感じる？","placeholder":"例：ノイミーの方が個性が強い気がする"},
  {"label":"グッズは？","placeholder":"例：推しの生写真を集めてる"},
  {"label":"ノイミーの魅力を一言","placeholder":"例：個性的なメンバーが揃ってる"}
]'),

('≒JOY', array['音楽・アイドル','その他国内女性'], '[
  {"label":"ニアジョイ担歴は？","placeholder":"例：オーディションから"},
  {"label":"ライブに年何回行く？","placeholder":"例：年2〜3回"},
  {"label":"推しメンは？","placeholder":"例：まだ全員推してる"},
  {"label":"≒JOYのここが好き！","placeholder":"例：デビュー直後の初々しさと成長過程"},
  {"label":"好きな曲は？","placeholder":"例：「ニアジョイ」"},
  {"label":"指原莉乃プロデュースへの期待は？","placeholder":"例：≠MEみたいに育ってほしい"},
  {"label":"≒JOYの魅力を一言","placeholder":"例：これからが楽しみ"}
]');

-- ============================================================
-- [9] 音楽・アイドル > KPOP男性（8グループ）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('BTS（防弾少年団）', array['音楽・アイドル','KPOP','男性グループ'], '[
  {"label":"ARMY歴は？","placeholder":"例：「DOPE」で沼落ち"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年2回、海外遠征もした"},
  {"label":"推しメンは？","placeholder":"例：V（テテ）、ジョングク"},
  {"label":"BTSのここが好き！","placeholder":"例：音楽性の深さとメンバーの絆"},
  {"label":"好きな曲は？","placeholder":"例：「Spring Day」「DNA」「Dynamite」"},
  {"label":"韓国語は勉強してる？","placeholder":"例：ハングル読めるようになった"},
  {"label":"グッズ・ペンライト（アーミーボム）は？","placeholder":"例：アーミーボムは全世代持ってる"},
  {"label":"兵役中の今、どう過ごしてる？","placeholder":"例：ソロ活動を追いながら待ってる"},
  {"label":"BTSと出会って変わったことは？","placeholder":"例：韓国語を勉強し始めた"},
  {"label":"BTSに一言","placeholder":"例：全員揃って帰ってきてください"}
]'),

('SEVENTEEN', array['音楽・アイドル','KPOP','男性グループ'], '[
  {"label":"CARAT歴は？","placeholder":"例：「Adore U」デビューから"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年2回、ドームも行く"},
  {"label":"推しメンは？","placeholder":"例：ウジ、ジョシュア"},
  {"label":"SEVENTEENのここが好き！","placeholder":"例：自作曲・自己プロデュースと13人の多様性"},
  {"label":"好きな曲は？","placeholder":"例：「Pretty U」「Don''t Wanna Cry」「Left & Right」"},
  {"label":"ユニット（ボーカル・ヒップホップ・パフォーマンス）はどれが好き？","placeholder":"例：パフォーマンスチームのダンスが好き"},
  {"label":"韓国語は勉強してる？","placeholder":"例：セブチのために頑張ってる"},
  {"label":"グッズは？","placeholder":"例：クラッカー（ペンライト）は必需品"},
  {"label":"13人いるから全員把握するまでどれくらいかかった？","placeholder":"例：半年かかった"},
  {"label":"SEVENTEENの魅力を一言","placeholder":"例：自分たちで作るから本物"}
]'),

('Stray Kids', array['音楽・アイドル','KPOP','男性グループ'], '[
  {"label":"STAY歴は？","placeholder":"例：PRODUCE 101出演から"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年2回"},
  {"label":"推しメンは？","placeholder":"例：バン・チャン、フィリックス"},
  {"label":"Stray Kidsのここが好き！","placeholder":"例：3RACHA自作の音楽と尖ったコンセプト"},
  {"label":"好きな曲は？","placeholder":"例：「MIROH」「God''s Menu」「MANIAC」"},
  {"label":"自作曲へのこだわりをどう思う？","placeholder":"例：だからこそ本物感がある"},
  {"label":"グッズは？","placeholder":"例：リノのウサギグッズを集めてる"},
  {"label":"韓国語は勉強してる？","placeholder":"例：バン・チャンのオストレに助けてもらってる"},
  {"label":"Stray Kidsの魅力を一言","placeholder":"例：自分たちを信じろというメッセージ"}
]'),

('ENHYPEN', array['音楽・アイドル','KPOP','男性グループ'], '[
  {"label":"ENGENE歴は？","placeholder":"例：I-LAND（オーディション番組）から"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年2回"},
  {"label":"推しメンは？","placeholder":"例：ニキ、ジェイ"},
  {"label":"ENHYPENのここが好き！","placeholder":"例：ダークな世界観と7人のビジュアル"},
  {"label":"好きな曲は？","placeholder":"例：「Given-Taken」「Drunk-Dazed」「Future Perfect」"},
  {"label":"I-LANDは見てた？","placeholder":"例：毎週泣きながら見てた"},
  {"label":"グッズは？","placeholder":"例：ペンライトとフォトカードを集めてる"},
  {"label":"ENHYPENの魅力を一言","placeholder":"例：成長過程を見守ってる親の気持ち"}
]'),

('TXT（TOMORROW X TOGETHER）', array['音楽・アイドル','KPOP','男性グループ'], '[
  {"label":"MOA歴は？","placeholder":"例：「Crown」デビューから"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年2回"},
  {"label":"推しメンは？","placeholder":"例：ヨンジュン、テヒョン"},
  {"label":"TXTのここが好き！","placeholder":"例：独自の世界観とオルタナティブな音楽性"},
  {"label":"好きな曲は？","placeholder":"例：「Crown」「0X1=LOVESONG」「Chasing That Feeling」"},
  {"label":"BTSとのつながりはどう感じる？","placeholder":"例：世界観がリンクしてて面白い"},
  {"label":"グッズは？","placeholder":"例：ペンライト（モア・スター）"},
  {"label":"TXTの魅力を一言","placeholder":"例：青春と孤独を歌う世界観がたまらない"}
]'),

('ATEEZ', array['音楽・アイドル','KPOP','男性グループ'], '[
  {"label":"ATINY歴は？","placeholder":"例：「PIRATE KING」から"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年2回、海外遠征もした"},
  {"label":"推しメンは？","placeholder":"例：ホンジュン、ミンギ"},
  {"label":"ATEEZのここが好き！","placeholder":"例：ライブのステージ力と世界観の一貫性"},
  {"label":"好きな曲は？","placeholder":"例：「WAVE」「Fireworks」「BOUNCY」"},
  {"label":"世界ツアーを見てどう思った？","placeholder":"例：欧米での人気が本物"},
  {"label":"グッズは？","placeholder":"例：海賊モチーフのグッズを集めてる"},
  {"label":"ATEEZの魅力を一言","placeholder":"例：ライブで本物かどうか分かる"}
]'),

('SHINee', array['音楽・アイドル','KPOP','男性グループ'], '[
  {"label":"シャイニー歴は？","placeholder":"例：「Replay」デビューから"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年1〜2回"},
  {"label":"推しメンは？","placeholder":"例：テミン、オンユ"},
  {"label":"SHINeeのここが好き！","placeholder":"例：KPOPの礎を作った本物のパフォーマンス"},
  {"label":"好きな曲は？","placeholder":"例：「Ring Ding Dong」「Lucifer」「View」"},
  {"label":"ジョンヒョンへの思いを一言","placeholder":"例：今でも大切なメンバー"},
  {"label":"テミンのソロも追ってる？","placeholder":"例：ソロになっても応援してる"},
  {"label":"SHINeeの魅力を一言","placeholder":"例：KPOPの歴史そのもの"}
]'),

('NCT 127', array['音楽・アイドル','KPOP','男性グループ'], '[
  {"label":"NCTzen歴は？","placeholder":"例：「Limitless」から"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年2回"},
  {"label":"推しメンは？","placeholder":"例：テヨン、ジェヒョン"},
  {"label":"NCT 127のここが好き！","placeholder":"例：実験的な音楽性と高い歌唱力"},
  {"label":"好きな曲は？","placeholder":"例：「Kick It」「Punch」「Sticker」"},
  {"label":"NCTの他ユニット（Dream等）も追ってる？","placeholder":"例：127専だけどDreamも好き"},
  {"label":"グッズは？","placeholder":"例：ペンライト（ライトスティック）"},
  {"label":"NCT 127の魅力を一言","placeholder":"例：KPOPの概念を壊す音楽"}
]');

-- ============================================================
-- [10] 音楽・アイドル > KPOP女性（7グループ）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('BLACKPINK', array['音楽・アイドル','KPOP','女性グループ'], '[
  {"label":"BLINK歴は？","placeholder":"例：「BOOMBAYAH」デビューから"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年1〜2回、ワールドツアーも"},
  {"label":"推しメンは？","placeholder":"例：ジェニー、ロゼ"},
  {"label":"BLACKPINKのここが好き！","placeholder":"例：圧倒的なビジュアルとカリスマ"},
  {"label":"好きな曲は？","placeholder":"例：「DDU-DU DDU-DU」「How You Like That」「Pink Venom」"},
  {"label":"韓国語は勉強してる？","placeholder":"例：ジェニーのために韓国語始めた"},
  {"label":"グッズは？","placeholder":"例：ハンマー（ペンライト）持ってる"},
  {"label":"ソロ活動も追ってる？","placeholder":"例：ジェニーのソロが特に好き"},
  {"label":"BLACKPINKの魅力を一言","placeholder":"例：世界レベルのガールクラッシュ"}
]'),

('NewJeans', array['音楽・アイドル','KPOP','女性グループ'], '[
  {"label":"NewJeansのファン歴は？","placeholder":"例：「Attention」でデビューから即沼"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年1〜2回"},
  {"label":"推しメンは？","placeholder":"例：ハニ、ミンジ"},
  {"label":"NewJeansのここが好き！","placeholder":"例：Y2K・シティポップ感の新鮮なコンセプト"},
  {"label":"好きな曲は？","placeholder":"例：「Hype Boy」「OMG」「Super Shy」"},
  {"label":"デビューしてすぐ好きになった？","placeholder":"例：「Attention」のMV見て即落ちした"},
  {"label":"グッズは？","placeholder":"例：バニーフォンを集めてる"},
  {"label":"NewJeansの魅力を一言","placeholder":"例：これが今の時代のポップ"}
]'),

('aespa', array['音楽・アイドル','KPOP','女性グループ'], '[
  {"label":"MY歴は？","placeholder":"例：「Black Mamba」デビューから"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年1〜2回"},
  {"label":"推しメンは？","placeholder":"例：カリナ、ウィンター"},
  {"label":"aespaのここが好き！","placeholder":"例：メタバース世界観と強いビジュアル"},
  {"label":"好きな曲は？","placeholder":"例：「Next Level」「Savage」「Drama」"},
  {"label":"世界観（SMCU）は追ってる？","placeholder":"例：NightWhale・KWANGYA全部追ってる"},
  {"label":"グッズは？","placeholder":"例：メタバースモチーフのグッズ"},
  {"label":"aespaの魅力を一言","placeholder":"例：SM流の本気の世界観が好き"}
]'),

('IVE', array['音楽・アイドル','KPOP','女性グループ'], '[
  {"label":"IVEのファン歴は？","placeholder":"例：「ELEVEN」デビューから"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年1〜2回"},
  {"label":"推しメンは？","placeholder":"例：ウォニョン、レイ"},
  {"label":"IVEのここが好き！","placeholder":"例：圧倒的ビジュアルと女神コンセプト"},
  {"label":"好きな曲は？","placeholder":"例：「ELEVEN」「LOVE DIVE」「I AM」"},
  {"label":"ウォニョンのセンター力をどう思う？","placeholder":"例：生まれながらのセンターだと思う"},
  {"label":"グッズは？","placeholder":"例：フォトカードを集めてる"},
  {"label":"IVEの魅力を一言","placeholder":"例：見るだけで気分が上がる"}
]'),

('TWICE', array['音楽・アイドル','KPOP','女性グループ'], '[
  {"label":"ONCE歴は？","placeholder":"例：「CHEER UP」から"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年2回、ドームも行く"},
  {"label":"推しメンは？","placeholder":"例：ナヨン、サナ"},
  {"label":"TWICEのここが好き！","placeholder":"例：9人9色の個性とポップな音楽"},
  {"label":"好きな曲は？","placeholder":"例：「CHEER UP」「TT」「Fancy」「MORE & MORE」"},
  {"label":"日本語曲と韓国語曲どっちが好き？","placeholder":"例：どっちも好きだけど日本語曲は特別"},
  {"label":"グッズは？","placeholder":"例：カンダン（ペンライト）と缶バッジ"},
  {"label":"TWICEと出会って変わったことは？","placeholder":"例：韓国に旅行するようになった"},
  {"label":"TWICEの魅力を一言","placeholder":"例：見ると元気になれるアイドル"}
]'),

('LE SSERAFIM', array['音楽・アイドル','KPOP','女性グループ'], '[
  {"label":"FEARNOT歴は？","placeholder":"例：デビューからずっと"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年1〜2回"},
  {"label":"推しメンは？","placeholder":"例：宮脇咲良、カズハ"},
  {"label":"LE SSERAFIMのここが好き！","placeholder":"例：fearless（恐れ知らず）なコンセプトと強さ"},
  {"label":"好きな曲は？","placeholder":"例：「FEARLESS」「ANTIFRAGILE」「EASY」"},
  {"label":"宮脇咲良・カズハが日本人なのはどう感じる？","placeholder":"例：日本人として誇らしい"},
  {"label":"グッズは？","placeholder":"例：フォトカードを集めてる"},
  {"label":"LE SSERAFIMの魅力を一言","placeholder":"例：強さと美しさの両立"}
]'),

('Red Velvet', array['音楽・アイドル','KPOP','女性グループ'], '[
  {"label":"ReVeluv歴は？","placeholder":"例：「Happiness」デビューから"},
  {"label":"コンサートに年何回行く？","placeholder":"例：年1〜2回"},
  {"label":"推しメンは？","placeholder":"例：アイリーン、ウェンディ"},
  {"label":"Red Velvetのここが好き！","placeholder":"例：Redコンセプトとvelvetコンセプトの振り幅"},
  {"label":"好きな曲は？","placeholder":"例：「Psycho」「Power Up」「Feel My Rhythm」"},
  {"label":"RedとVelvet、どっちのコンセプトが好き？","placeholder":"例：Velvetの方が好き"},
  {"label":"グッズは？","placeholder":"例：フォトカードとペンライト"},
  {"label":"Red Velvetの魅力を一言","placeholder":"例：SMの本気のガールグループ"}
]');

-- ============================================================
-- [11] 音楽・アイドル > 邦楽アーティスト（25）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('Official髭男dism', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"髭男を好きになったのは？","placeholder":"例：「Pretender」でやられた"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1〜2回、武道館も"},
  {"label":"好きな曲は？","placeholder":"例：「Pretender」「I LOVE...」「Subtitle」"},
  {"label":"藤原聡のボーカルについて一言","placeholder":"例：日本一の声だと思ってる"},
  {"label":"髭男の魅力を一言","placeholder":"例：メロディと歌詞の質が段違い"}
]'),

('King Gnu', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"King Gnuを好きになったのは？","placeholder":"例：「白日」で衝撃を受けた"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1回、フェスで"},
  {"label":"好きな曲は？","placeholder":"例：「白日」「三文小説」「Teenager Forever」"},
  {"label":"常田大希の音楽センスについて","placeholder":"例：天才すぎて言葉がない"},
  {"label":"King Gnuの魅力を一言","placeholder":"例：ジャンルを超えた唯一無二の音楽"}
]'),

('YOASOBI', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"YOASOBIを好きになったのは？","placeholder":"例：「夜に駆ける」がバズった頃"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1回"},
  {"label":"好きな曲は？","placeholder":"例：「夜に駆ける」「アイドル」「群青」"},
  {"label":"原作小説は読む？","placeholder":"例：曲を聴いてから小説を読んだ"},
  {"label":"ikuraのボーカルについて","placeholder":"例：真似できない声域"},
  {"label":"YOASOBIの魅力を一言","placeholder":"例：小説と音楽の融合という新しさ"}
]'),

('Mrs. GREEN APPLE', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"ミセスを好きになったのは？","placeholder":"例：「ロマンチシズム」「StaRt」で知って"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1〜2回"},
  {"label":"好きな曲は？","placeholder":"例：「StaRt」「青と夏」「ダンスホール」「コロンブス」"},
  {"label":"大森元貴の才能についてひとこと","placeholder":"例：作詞作曲歌全部できるのが凄い"},
  {"label":"Mrs. GREEN APPLEの魅力を一言","placeholder":"例：ポップなのに深みがある"}
]'),

('Ado', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"Adoを好きになったのは？","placeholder":"例：「うっせぇわ」でぶっ飛ばされた"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1回、顔出しなしのライブ"},
  {"label":"好きな曲は？","placeholder":"例：「うっせぇわ」「新時代」「阿修羅ちゃん」"},
  {"label":"顔出しなしのスタイルについてどう思う？","placeholder":"例：声だけで勝負してるのが好き"},
  {"label":"Adoの声の魅力を一言","placeholder":"例：一声で空気が変わる"}
]'),

('米津玄師', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"米津玄師を好きになったのは？","placeholder":"例：「Lemon」でハマった、ハチ時代から"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1回、倍率高くて苦労した"},
  {"label":"好きな曲は？","placeholder":"例：「Lemon」「KICK BACK」「Pale Blue」"},
  {"label":"ハチ時代は知ってる？","placeholder":"例：「マトリョシカ」からずっと追ってる"},
  {"label":"米津玄師の魅力を一言","placeholder":"例：日本音楽の現在地を更新し続けてる"}
]'),

('あいみょん', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"あいみょんを好きになったのは？","placeholder":"例：「マリーゴールド」で"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1〜2回"},
  {"label":"好きな曲は？","placeholder":"例：「マリーゴールド」「愛を伝えたいだとか」「裸の心」"},
  {"label":"あいみょんの歌詞の好きなフレーズは？","placeholder":"例：「君はロックを聴かない」の一節"},
  {"label":"あいみょんの魅力を一言","placeholder":"例：昭和的なのに今っぽい"}
]'),

('藤井風', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"藤井風を好きになったのは？","placeholder":"例：「何なんw」でやばいと思った"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1回、国立競技場も"},
  {"label":"好きな曲は？","placeholder":"例：「何なんw」「きらり」「grace」"},
  {"label":"藤井風の世界観についてひとこと","placeholder":"例：哲学的なのに親しみやすい"},
  {"label":"藤井風の魅力を一言","placeholder":"例：岡山生まれの天才、スケールが違う"}
]'),

('back number', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"バクナンを好きになったのは？","placeholder":"例：「高嶺の花子さん」で知って"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1〜2回"},
  {"label":"好きな曲は？","placeholder":"例：「水平線」「クリスマスソング」「HAPPY END」"},
  {"label":"失恋ソングとラブソング、どっちが好き？","placeholder":"例：失恋ソングの方が刺さる"},
  {"label":"back numberの魅力を一言","placeholder":"例：誰もが経験したあの感情を言葉にしてくれる"}
]'),

('RADWIMPS', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"RADを好きになったのは？","placeholder":"例：「君の名は。」より前から"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1〜2回"},
  {"label":"好きな曲は？","placeholder":"例：「前前前世」「愛にできることはまだあるかい」「おしゃかしゃま」"},
  {"label":"野田洋次郎の歌詞についてひとこと","placeholder":"例：哲学書みたいな歌詞が好き"},
  {"label":"アニメ映画との相性についてどう思う？","placeholder":"例：新海誠とのコラボが奇跡的"},
  {"label":"RADWIMPSの魅力を一言","placeholder":"例：日本語ロックの最高峰"}
]'),

('ONE OK ROCK', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"ワンオクを好きになったのは？","placeholder":"例：「Re:make」で衝撃を受けた"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1〜2回、海外公演も"},
  {"label":"好きな曲は？","placeholder":"例：「Wherever You Are」「The Beginning」「Cry out」"},
  {"label":"英語詞と日本語詞どっちが好き？","placeholder":"例：昔の日本語詞の方が好き"},
  {"label":"海外での活躍についてどう思う？","placeholder":"例：日本のロックを世界に持っていってくれてる"},
  {"label":"ONE OK ROCKの魅力を一言","placeholder":"例：Takaの声とスケールの大きさ"}
]'),

('Mr.Children', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"ミスチルを好きになったのは？","placeholder":"例：「innocent world」の頃から"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1〜2回、スタジアムも"},
  {"label":"好きな曲は？","placeholder":"例：「Tomorrow never knows」「Sign」「HANABI」"},
  {"label":"桜井和寿の歌詞で一番好きなフレーズは？","placeholder":"例：「365日」の一節"},
  {"label":"30年以上聴き続けてる理由は？","placeholder":"例：どの時代の自分にも寄り添ってくれる"},
  {"label":"Mr.Childrenの魅力を一言","placeholder":"例：日本のロックバンドの頂点"}
]'),

('B\'z', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"B''zを好きになったのは？","placeholder":"例：「ultra soul」で目覚めた"},
  {"label":"ライブに行ったことある？","placeholder":"例：B''z LIVEに年1回"},
  {"label":"好きな曲は？","placeholder":"例：「ultra soul」「さまよえる蒼い弾丸」「稲葉さんの声が好き」"},
  {"label":"稲葉浩志と松本孝弘、どっちが好き？","placeholder":"例：どちらも神だけど稲葉さんの声が好き"},
  {"label":"グッズは？","placeholder":"例：ライブTシャツを集めてる"},
  {"label":"B''zの魅力を一言","placeholder":"例：日本のロックの金字塔"}
]'),

('L\'Arc-en-Ciel', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"ラルクを好きになったのは？","placeholder":"例：「虹」「HONEY」で沼落ち"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1〜2回"},
  {"label":"好きな曲は？","placeholder":"例：「flower」「HONEY」「Driver''s High」"},
  {"label":"hydeのビジュアルと声についてひとこと","placeholder":"例：唯一無二の存在"},
  {"label":"ラルクの魅力を一言","placeholder":"例：90年代ジャパニーズロックの最高峰"}
]'),

('GLAY', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"GLAYを好きになったのは？","placeholder":"例：「HOWEVER」で泣いた"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1回、幕張も"},
  {"label":"好きな曲は？","placeholder":"例：「HOWEVER」「Winter, again」「BE WITH YOU」"},
  {"label":"TERUとTAKUROどっちが好き？","placeholder":"例：TERUの声が大好き"},
  {"label":"GLAYの魅力を一言","placeholder":"例：30年経っても変わらないロックへの情熱"}
]'),

('BUMP OF CHICKEN', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"バンプを好きになったのは？","placeholder":"例：「天体観測」で宇宙に飛んだ"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1回"},
  {"label":"好きな曲は？","placeholder":"例：「天体観測」「花の名」「星の鳥」"},
  {"label":"藤原基央の歌詞で好きな一節は？","placeholder":"例：「天体観測」の「見つけたよ」"},
  {"label":"バンプの魅力を一言","placeholder":"例：孤独と向き合う人への最高のBGM"}
]'),

('スピッツ', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"スピッツを好きになったのは？","placeholder":"例：「ロビンソン」「チェリー」で"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1回、フェスで会える"},
  {"label":"好きな曲は？","placeholder":"例：「ロビンソン」「チェリー」「空も飛べるはず」"},
  {"label":"草野マサムネの声についてひとこと","placeholder":"例：唯一無二の優しさがある"},
  {"label":"スピッツの魅力を一言","placeholder":"例：何十年経っても色褪せない普遍性"}
]'),

('サカナクション', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"サカナクションを好きになったのは？","placeholder":"例：「新宝島」でハマった"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1回、NF（night fishing）も"},
  {"label":"好きな曲は？","placeholder":"例：「新宝島」「アイデンティティ」「ミュージック」"},
  {"label":"山口一郎の世界観についてひとこと","placeholder":"例：ライブが映像作品のようで別格"},
  {"label":"サカナクションの魅力を一言","placeholder":"例：踊れるのに文学的"}
]'),

('マキシマムザホルモン', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"ホルモンを好きになったのは？","placeholder":"例：「maximum the hormone」で衝撃"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1〜2回、モッシュで"},
  {"label":"好きな曲は？","placeholder":"例：「恋のメガラバ」「maximum the hormone」「握れっ！」"},
  {"label":"ダイスケはんと亮君、どっちのボーカルが好き？","placeholder":"例：両方の落差が最高"},
  {"label":"ホルモンの魅力を一言","placeholder":"例：他に似たものがない、唯一無二"}
]'),

('10-FEET', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"10-FEETを好きになったのは？","placeholder":"例：「RIVER」「1sec.」で"},
  {"label":"ライブに行ったことある？","placeholder":"例：京都大作戦に毎年行く"},
  {"label":"好きな曲は？","placeholder":"例：「RIVER」「goes on」「蜃気楼」"},
  {"label":"京都大作戦についてひとこと","placeholder":"例：日本一好きなフェス"},
  {"label":"10-FEETの魅力を一言","placeholder":"例：京都から発信する本物のロック"}
]'),

('Vaundy', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"Vaundyを好きになったのは？","placeholder":"例：「東京フラッシュ」で知って"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1回"},
  {"label":"好きな曲は？","placeholder":"例：「東京フラッシュ」「不快のマーチ」「怪獣の花唄」"},
  {"label":"Vaundyの天才性についてひとこと","placeholder":"例：20代前半でこれは末恐ろしい"},
  {"label":"Vaundyの魅力を一言","placeholder":"例：ジャンルを超えたポップの才能"}
]'),

('クリープハイプ', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"クリープハイプを好きになったのは？","placeholder":"例：「おやすみ泣き声、さよなら歌姫」で"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1〜2回"},
  {"label":"好きな曲は？","placeholder":"例：「鬼」「ナントカナレ」「栞」"},
  {"label":"尾崎世界観の歌詞についてひとこと","placeholder":"例：痛いくらい刺さる言葉"},
  {"label":"クリープハイプの魅力を一言","placeholder":"例：日常の痛みを歌にする天才"}
]'),

('マカロニえんぴつ', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"マカロニえんぴつを好きになったのは？","placeholder":"例：「恋人ごっこ」「なんでもないよ、」で"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1〜2回"},
  {"label":"好きな曲は？","placeholder":"例：「恋人ごっこ」「なんでもないよ、」「はしりがき」"},
  {"label":"はっとりの歌詞のどこが好き？","placeholder":"例：日常をここまで切り取れるのが凄い"},
  {"label":"マカロニえんぴつの魅力を一言","placeholder":"例：青春と恋愛を丁寧に歌う"}
]'),

('Saucy Dog', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"Saucy Dogを好きになったのは？","placeholder":"例：「いつか」「シンデレラボーイ」で"},
  {"label":"ライブに行ったことある？","placeholder":"例：年1回"},
  {"label":"好きな曲は？","placeholder":"例：「シンデレラボーイ」「いつか」「ゆだねたいまま」"},
  {"label":"石原慎也のボーカルについて","placeholder":"例：泣き声みたいな声が刺さる"},
  {"label":"Saucy Dogの魅力を一言","placeholder":"例：泣ける曲ならSaucy Dog一択"}
]'),

('フェス好き・ライブキッズ', array['音楽・アイドル','邦楽アーティスト'], '[
  {"label":"フェス歴は？","placeholder":"例：ROCK IN JAPANに10年通ってる"},
  {"label":"年間何本ライブ・フェスに行く？","placeholder":"例：年20本以上"},
  {"label":"好きなフェスは？","placeholder":"例：ROCK IN JAPAN、SUMMER SONIC、京都大作戦"},
  {"label":"フェスでのスタイルは？","placeholder":"例：前方でモッシュ派、後方でビール派"},
  {"label":"今年楽しみにしてるアーティストは？","placeholder":"例：まだ内緒"},
  {"label":"ライブ遠征は？","placeholder":"例：北海道から九州まで行く"},
  {"label":"フェスの魅力を一言","placeholder":"例：普段聴かないアーティストに出会える"}
]');

-- ============================================================
-- [12] 音楽・アイドル > VTuber・歌い手（6）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('ホロライブ', array['音楽・アイドル','VTuber・配信'], '[
  {"label":"ホロリスナー歴は？","placeholder":"例：コロナ禍から見始めた"},
  {"label":"推しVは？","placeholder":"例：兎田ぺこら、宝鐘マリン"},
  {"label":"主に何のコンテンツを見る？","placeholder":"例：ゲーム配信、歌枠、切り抜き"},
  {"label":"ホロライブのここが好き！","placeholder":"例：箱推しできる一体感"},
  {"label":"ライブ・イベントに行ったことある？","placeholder":"例：ホロライブフェスに行った"},
  {"label":"グッズは？","placeholder":"例：推しのアクリルスタンド"},
  {"label":"スパチャは飛ばす派？","placeholder":"例：たまに飛ばす"},
  {"label":"ホロライブの魅力を一言","placeholder":"例：才能ある人が集まってる"}
]'),

('にじさんじ', array['音楽・アイドル','VTuber・配信'], '[
  {"label":"にじさんじリスナー歴は？","placeholder":"例：にじさんじ甲子園から"},
  {"label":"推しライバーは？","placeholder":"例：月ノ美兎、葛葉"},
  {"label":"主に何のコンテンツを見る？","placeholder":"例：雑談配信、コラボ配信"},
  {"label":"にじさんじのここが好き！","placeholder":"例：ライバー同士のコラボの自由さ"},
  {"label":"甲子園・歌配信どっちが好き？","placeholder":"例：コラボ配信が一番好き"},
  {"label":"グッズは？","placeholder":"例：推しのボイスと缶バッジ"},
  {"label":"にじさんじの魅力を一言","placeholder":"例：人間が好きなら絶対ハマる"}
]'),

('ホロライブEN', array['音楽・アイドル','VTuber・配信'], '[
  {"label":"HoloEN歴は？","placeholder":"例：Myth世代から"},
  {"label":"推しメンは？","placeholder":"例：がうる・ぐら、森カリオペ"},
  {"label":"英語配信はどうやって楽しんでる？","placeholder":"例：英語の勉強も兼ねて見てる"},
  {"label":"HoloENのここが好き！","placeholder":"例：グローバルな視点のコンテンツ"},
  {"label":"HoloENの魅力を一言","placeholder":"例：VTuber文化を世界に広げた"}
]'),

('にじさんじEN', array['音楽・アイドル','VTuber・配信'], '[
  {"label":"NIJISANJI EN歴は？","placeholder":"例：LazuLightから"},
  {"label":"推しライバーは？","placeholder":"例：Elira Pendora、Vox Akuma"},
  {"label":"英語配信はどうやって楽しんでる？","placeholder":"例：英語リスニング力がついた"},
  {"label":"にじさんじENのここが好き！","placeholder":"例：多国籍な個性とにじさんじらしい自由さ"},
  {"label":"にじさんじENの魅力を一言","placeholder":"例：VTuber文化の多様性を体現してる"}
]'),

('歌い手・ボカロ好き', array['音楽・アイドル','VTuber・配信'], '[
  {"label":"歌い手・ボカロ文化を知ったのは？","placeholder":"例：ニコニコ動画の全盛期から"},
  {"label":"好きな歌い手は？","placeholder":"例：まふまふ、うらたぬき"},
  {"label":"好きなボカロ曲は？","placeholder":"例：「千本桜」「炉心融解」「Ghost Rule」"},
  {"label":"歌ってみた文化のどこが好き？","placeholder":"例：自分の解釈で歌うカバーが好き"},
  {"label":"自分でも歌ってみたやってる？","placeholder":"例：こっそりやってる"},
  {"label":"最近好きな曲は？","placeholder":"例：まだ内緒"}
]'),

('ストリーマー・ゲーム実況好き', array['音楽・アイドル','VTuber・配信'], '[
  {"label":"ゲーム実況を見始めたのは？","placeholder":"例：ヒカキンのマイクラから"},
  {"label":"好きなストリーマーは？","placeholder":"例：釈迦、k4sen"},
  {"label":"主に何のゲームの配信を見る？","placeholder":"例：FPS、ソロ探索系"},
  {"label":"Twitch派？YouTube派？","placeholder":"例：Twitch派"},
  {"label":"配信文化のここが好き！","placeholder":"例：リアルタイムのコメントで一緒に盛り上がれる"},
  {"label":"ストリーマーの魅力を一言","placeholder":"例：ゲームの上手さよりキャラクターが大事"}
]');

-- ============================================================
-- [13] アニメ・マンガ（16作品）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('ワンピース', array['アニメ・ゲーム','アニメ・マンガ'], '[
  {"label":"ワンピース歴は？","placeholder":"例：連載初期から27年"},
  {"label":"推しキャラは？","placeholder":"例：ゾロ、ナミ"},
  {"label":"好きな編・アークは？","placeholder":"例：マリンフォード編、ドレスローザ編"},
  {"label":"悪魔の実を食べるなら？","placeholder":"例：ゴムゴムの実一択"},
  {"label":"麦わら海賊団で自分がなりたいポジションは？","placeholder":"例：航法士"},
  {"label":"アニメ派 or 原作派？","placeholder":"例：原作で読んでアニメも見る"},
  {"label":"ワンピースを一言で語るなら","placeholder":"例：人生で一番泣けるマンガ"}
]'),

('鬼滅の刃', array['アニメ・ゲーム','アニメ・マンガ'], '[
  {"label":"鬼滅にハマったのは？","placeholder":"例：無限列車でやられた"},
  {"label":"推しキャラは？","placeholder":"例：冨岡義勇、煉獄さん"},
  {"label":"好きな呼吸は？","placeholder":"例：炎の呼吸、水の呼吸"},
  {"label":"泣いた場面は？","placeholder":"例：無限列車のラストで号泣"},
  {"label":"グッズは？","placeholder":"例：冨岡さんのアクスタ"},
  {"label":"柱の中で誰が一番好き？","placeholder":"例：煉獄さんは永遠に好き"},
  {"label":"鬼滅の魅力を一言","placeholder":"例：家族の絆と師への敬意が泣ける"}
]'),

('呪術廻戦', array['アニメ・ゲーム','アニメ・マンガ'], '[
  {"label":"呪術廻戦を知ったのは？","placeholder":"例：アニメ1期から"},
  {"label":"推しキャラは？","placeholder":"例：五条悟、伏黒恵"},
  {"label":"好きな術式・必殺技は？","placeholder":"例：無下限呪術・蒼"},
  {"label":"渋谷事変についてひとこと","placeholder":"例：あれは精神的にきつかった"},
  {"label":"グッズは？","placeholder":"例：五条悟のアクスタ"},
  {"label":"芥見下々の伏線回収についてどう思う？","placeholder":"例：天才の仕事だと思う"},
  {"label":"呪術廻戦の魅力を一言","placeholder":"例：バトル漫画の新時代"}
]'),

('ドラゴンボール', array['アニメ・ゲーム','アニメ・マンガ'], '[
  {"label":"ドラゴンボール歴は？","placeholder":"例：幼少期のリアルタイム放送から"},
  {"label":"推しキャラは？","placeholder":"例：ベジータ、悟空"},
  {"label":"一番好きなフォームは？","placeholder":"例：超サイヤ人3、身勝手の極意"},
  {"label":"最も熱かった戦いは？","placeholder":"例：悟空vsフリーザ、悟空vsベジータ"},
  {"label":"ドラゴンボールGTとSuperどっちが好き？","placeholder":"例：Zが一番好き"},
  {"label":"ドラゴンボールの魅力を一言","placeholder":"例：少年漫画の全ての原点"}
]'),

('NARUTO', array['アニメ・ゲーム','アニメ・マンガ'], '[
  {"label":"NARUTO歴は？","placeholder":"例：連載開始から"},
  {"label":"推しキャラは？","placeholder":"例：うちはイタチ、カカシ先生"},
  {"label":"好きな忍術は？","placeholder":"例：須佐能乎、螺旋丸"},
  {"label":"チームは第七班推し？","placeholder":"例：自来也チームの方が好き"},
  {"label":"NARUTOで一番泣いた場面は？","placeholder":"例：イタチの真実が明かされた時"},
  {"label":"NARUTOの魅力を一言","placeholder":"例：忍道を貫く熱さと家族の物語"}
]'),

('スラムダンク', array['アニメ・ゲーム','アニメ・マンガ'], '[
  {"label":"スラムダンク歴は？","placeholder":"例：連載当時からのリアル世代"},
  {"label":"推しキャラは？","placeholder":"例：流川楓、三井寿"},
  {"label":"山王戦で一番好きな場面は？","placeholder":"例：桜木のリバウンドのあのシーン"},
  {"label":"映画「THE FIRST SLAM DUNK」は見た？","placeholder":"例：映画館で3回見た"},
  {"label":"湘北の中で自分に似てるキャラは？","placeholder":"例：花道（ポジティブすぎる）"},
  {"label":"スラムダンクの魅力を一言","placeholder":"例：バスケを超えた青春の物語"}
]'),

('ハイキュー！！', array['アニメ・ゲーム','アニメ・マンガ'], '[
  {"label":"ハイキュー歴は？","placeholder":"例：アニメ1期から"},
  {"label":"推しキャラは？","placeholder":"例：影山飛雄、及川徹"},
  {"label":"推しチームは？","placeholder":"例：烏野高校、音駒高校"},
  {"label":"好きなコンビ・コンビネーションは？","placeholder":"例：日向と影山のクイック"},
  {"label":"バレーを実際にやってる？","placeholder":"例：ハイキューのせいで始めた"},
  {"label":"ハイキューの魅力を一言","placeholder":"例：スポーツ漫画の頂点"}
]'),

('ブルーロック', array['アニメ・ゲーム','アニメ・マンガ'], '[
  {"label":"ブルーロック歴は？","placeholder":"例：連載初期から"},
  {"label":"推しキャラは？","placeholder":"例：潔世一、糸師凛"},
  {"label":"自分がブルーロックに参加したら何番？","placeholder":"例：300番台で早々に脱落"},
  {"label":"ブルーロックの世界観についてひとこと","placeholder":"例：エゴの哲学が刺さる"},
  {"label":"サッカーはやってた？","placeholder":"例：ブルーロックで興味持った"},
  {"label":"ブルーロックの魅力を一言","placeholder":"例：サッカー漫画とは思えないメンタル描写"}
]'),

('進撃の巨人', array['アニメ・ゲーム','アニメ・マンガ'], '[
  {"label":"進撃歴は？","placeholder":"例：アニメ1期から"},
  {"label":"推しキャラは？","placeholder":"例：リヴァイ兵長、エレン"},
  {"label":"最終回についてどう思う？","placeholder":"例：納得派、受け入れられない派"},
  {"label":"一番衝撃を受けたシーンは？","placeholder":"例：104期の正体が明かされた時"},
  {"label":"壁の外の世界について初めて知った時の気持ちは？","placeholder":"例：鳥肌が立った"},
  {"label":"進撃の魅力を一言","placeholder":"例：伏線と絶望で読む者を支配する"}
]'),

('ヒロアカ（僕のヒーローアカデミア）', array['アニメ・ゲーム','アニメ・マンガ'], '[
  {"label":"ヒロアカ歴は？","placeholder":"例：アニメ1期から"},
  {"label":"推しキャラは？","placeholder":"例：爆豪勝己、轟焦凍"},
  {"label":"個性（クセ）を一つもらえるなら？","placeholder":"例：半冷半燃"},
  {"label":"U.A.に入学できたとしたら何科？","placeholder":"例：ヒーロー科一択"},
  {"label":"一番好きなヒーローは？","placeholder":"例：オールマイト"},
  {"label":"ヒロアカの魅力を一言","placeholder":"例：継承と超克のテーマが熱い"}
]'),

('SPY×FAMILY', array['アニメ・ゲーム','アニメ・マンガ'], '[
  {"label":"SPY×FAMILYを知ったのは？","placeholder":"例：アニメ化で"},
  {"label":"推しキャラは？","placeholder":"例：アーニャ、ロイド"},
  {"label":"アーニャの好きなリアクションは？","placeholder":"例：ほぐれる顔"},
  {"label":"ロイド・ヨルどっちが好き？","placeholder":"例：ヨルさんの天然さが好き"},
  {"label":"SPY×FAMILYの魅力を一言","placeholder":"例：ほっこりして笑えてたまに泣ける"}
]'),

('推しの子', array['アニメ・ゲーム','アニメ・マンガ'], '[
  {"label":"推しの子を知ったのは？","placeholder":"例：アニメ1話のOP「アイドル」で"},
  {"label":"推しキャラは？","placeholder":"例：アクア、有馬かな"},
  {"label":"アイドル産業の描写についてどう思う？","placeholder":"例：リアルすぎて怖かった"},
  {"label":"「アイドル」（YOASOBI）は聴いた？","placeholder":"例：何百回も聴いた"},
  {"label":"ルビーとアクア、どっちが好き？","placeholder":"例：アクアの闇落ち感が好き"},
  {"label":"推しの子の魅力を一言","placeholder":"例：エンタメ業界の光と闇を描いた傑作"}
]'),

('葬送のフリーレン', array['アニメ・ゲーム','アニメ・マンガ'], '[
  {"label":"フリーレンを知ったのは？","placeholder":"例：アニメ化で"},
  {"label":"推しキャラは？","placeholder":"例：フリーレン、フェルン"},
  {"label":"1話のヒンメルの葬送で泣いた？","placeholder":"例：開始15分で泣いた"},
  {"label":"フリーレンのここが好き！","placeholder":"例：時間の流れ方とエルフの視点"},
  {"label":"フリーレンの魅力を一言","placeholder":"例：冒険の後日談という革命的な設定"}
]'),

('ラブライブ！', array['アニメ・ゲーム','アニメ・マンガ'], '[
  {"label":"ラブライブ歴は？","placeholder":"例：μ''s時代から"},
  {"label":"推しスクールアイドルは？","placeholder":"例：高坂穂乃果、矢澤にこ"},
  {"label":"好きなシリーズは？","placeholder":"例：μ''s、Aqours、虹ヶ咲、Liella！"},
  {"label":"ライブ（LoveLive!）に行ったことある？","placeholder":"例：武道館・東京ドームに行った"},
  {"label":"好きな曲は？","placeholder":"例：「僕らのLIVE 君とのLIFE」「Snow halation」"},
  {"label":"ラブライブの魅力を一言","placeholder":"例：アイドルを応援するという体験を作り出してる"}
]'),

('ぼっち・ざ・ろっく！', array['アニメ・ゲーム','アニメ・マンガ'], '[
  {"label":"ぼっちざろっくを知ったのは？","placeholder":"例：アニメ放送時、バズりで"},
  {"label":"推しキャラは？","placeholder":"例：後藤ひとり、伊地知虹夏"},
  {"label":"バンドはやってる or やりたい？","placeholder":"例：ギター始めた"},
  {"label":"ぼっちちゃんの陰キャ描写で共感したシーンは？","placeholder":"例：全部共感しすぎてつらい"},
  {"label":"好きな曲は？","placeholder":"例：「転がる岩、君には朝が来ない」"},
  {"label":"ぼっち・ざ・ろっくの魅力を一言","placeholder":"例：バンドへの愛とコミュ障への愛"}
]'),

('ちいかわ', array['アニメ・ゲーム','アニメ・マンガ'], '[
  {"label":"ちいかわを知ったのは？","placeholder":"例：Twitterで流れてきて"},
  {"label":"推しキャラは？","placeholder":"例：ちいかわ、ハチワレ"},
  {"label":"グッズは持ってる？","placeholder":"例：ぬいぐるみを全種類"},
  {"label":"ちいかわの世界観の好きなところは？","placeholder":"例：可愛いのに時々ダークなギャップ"},
  {"label":"ちいかわの魅力を一言","placeholder":"例：かわいいだけじゃない深みがある"}
]');

-- ============================================================
-- [14] アニメ・ゲーム > 2.5次元・舞台（5）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('2.5次元舞台（全般）', array['アニメ・ゲーム','2.5次元・舞台'], '[
  {"label":"2.5次元にハマったのは？","placeholder":"例：テニミュを見てから"},
  {"label":"年何本舞台を見に行く？","placeholder":"例：年10本以上"},
  {"label":"好きな作品・座組は？","placeholder":"例：刀剣乱舞、テニミュ、ヘタミュ"},
  {"label":"推し俳優は？","placeholder":"例：まだ内緒"},
  {"label":"2.5次元の魅力を一言","placeholder":"例：次元の壁を越えてキャラが生きてる"}
]'),

('刀剣乱舞', array['アニメ・ゲーム','2.5次元・舞台'], '[
  {"label":"刀剣乱舞を知ったのは？","placeholder":"例：ゲームから、舞台から"},
  {"label":"推し刀剣男士は？","placeholder":"例：三日月宗近、山姥切国広"},
  {"label":"ゲーム派？舞台派？アニメ派？","placeholder":"例：舞台から入ってゲームもやってる"},
  {"label":"刀剣乱舞ミュージカルは見てる？","placeholder":"例：刀ミュは全ステ追ってる"},
  {"label":"刀剣乱舞（ライブ）は見てる？","placeholder":"例：刀ステも刀ミュも"},
  {"label":"日本刀に興味が出た？","placeholder":"例：博物館に刀を見に行くようになった"},
  {"label":"刀剣乱舞の魅力を一言","placeholder":"例：歴史とキャラの融合が唯一無二"}
]'),

('テニスの王子様（テニミュ）', array['アニメ・ゲーム','2.5次元・舞台'], '[
  {"label":"テニプリ・テニミュ歴は？","placeholder":"例：初代テニミュから20年"},
  {"label":"推しキャラ・推しチームは？","placeholder":"例：越前リョーマ、立海大"},
  {"label":"テニミュは何代目から見てる？","placeholder":"例：初代からぜんぶ"},
  {"label":"推し俳優は？","placeholder":"例：歴代リョーマ役みんな好き"},
  {"label":"テニミュの魅力を一言","placeholder":"例：青春と汗と涙と2.5次元の原点"}
]'),

('劇団四季・ミュージカル', array['アニメ・ゲーム','2.5次元・舞台'], '[
  {"label":"ミュージカル歴は？","placeholder":"例：10年前から見てる"},
  {"label":"好きな作品は？","placeholder":"例：「ライオンキング」「オペラ座の怪人」「アナ雪」"},
  {"label":"年何回劇場に行く？","placeholder":"例：年5〜6回"},
  {"label":"生で見て一番感動した作品は？","placeholder":"例：劇団四季のキャッツで泣いた"},
  {"label":"好きな俳優・女優は？","placeholder":"例：まだ内緒"},
  {"label":"ミュージカルの魅力を一言","placeholder":"例：歌と演技と踊りで全部感情が揺さぶられる"}
]'),

('宝塚歌劇団', array['アニメ・ゲーム','2.5次元・舞台'], '[
  {"label":"タカラジェンヌのファン歴は？","placeholder":"例：祖母に連れて行ってもらってハマった"},
  {"label":"好きな組は？","placeholder":"例：花組、月組"},
  {"label":"推しスターは？","placeholder":"例：まだ内緒"},
  {"label":"年何回宝塚大劇場・東京宝塚劇場に行く？","placeholder":"例：年3〜4回"},
  {"label":"好きな演目は？","placeholder":"例：「エリザベート」「ポーの一族」"},
  {"label":"宝塚の魅力を一言","placeholder":"例：夢の世界を現実に作り出す芸術"}
]');

-- ============================================================
-- [15] ゲーム > ソシャゲ・RPG（13）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('原神', array['アニメ・ゲーム','ソシャゲ・RPG'], '[
  {"label":"原神歴は？","placeholder":"例：リリース初日から"},
  {"label":"AR（冒険ランク）はいくつ？","placeholder":"例：AR60"},
  {"label":"推しキャラは？","placeholder":"例：胡桃、鍾離"},
  {"label":"推し元素は？","placeholder":"例：炎、岩"},
  {"label":"課金してる？","placeholder":"例：天井だけ課金するプレイヤー"},
  {"label":"好きなエリアは？","placeholder":"例：稲妻、フォンテーヌ"},
  {"label":"原神の魅力を一言","placeholder":"例：オープンワールドとキャラの深さが異次元"}
]'),

('崩壊：スターレイル', array['アニメ・ゲーム','ソシャゲ・RPG'], '[
  {"label":"スターレイル歴は？","placeholder":"例：リリースから"},
  {"label":"開拓レベルはいくつ？","placeholder":"例：開拓60"},
  {"label":"推しキャラは？","placeholder":"例：銀狼、カフカ"},
  {"label":"課金スタイルは？","placeholder":"例：月パスのみ"},
  {"label":"好きなストーリーは？","placeholder":"例：仙舟ルオフーが好き"},
  {"label":"スターレイルの魅力を一言","placeholder":"例：ターン制RPGの深さとシナリオが最高"}
]'),

('FGO（Fate/Grand Order）', array['アニメ・ゲーム','ソシャゲ・RPG'], '[
  {"label":"マスター歴は？","placeholder":"例：リリース初日から8年"},
  {"label":"推しサーヴァントは？","placeholder":"例：Fate/Zero 時代のキャスター"},
  {"label":"最も好きなメインシナリオは？","placeholder":"例：バビロニア、キャメロット"},
  {"label":"課金スタイルは？","placeholder":"例：推しに石を全部溶かす"},
  {"label":"Fateシリーズでの入口は？","placeholder":"例：TYPE-MOONのVNから"},
  {"label":"FGOの魅力を一言","placeholder":"例：シナリオの質とキャラへの愛着"}
]'),

('ウマ娘', array['アニメ・ゲーム','ソシャゲ・RPG'], '[
  {"label":"ウマ娘歴は？","placeholder":"例：リリースから"},
  {"label":"推しウマ娘は？","placeholder":"例：スペシャルウィーク、ゴールドシップ"},
  {"label":"リアルの競馬も見るようになった？","placeholder":"例：ウマ娘きっかけで競馬始めた"},
  {"label":"ランクはどのくらい？","placeholder":"例：URA決勝クリアできた"},
  {"label":"ウマ娘の魅力を一言","placeholder":"例：史実を知ると100倍泣ける"}
]'),

('グランブルーファンタジー（グラブル）', array['アニメ・ゲーム','ソシャゲ・RPG'], '[
  {"label":"グラブル歴は？","placeholder":"例：5周年から"},
  {"label":"騎空士レベルはいくつ？","placeholder":"例：300以上"},
  {"label":"推しキャラは？","placeholder":"例：ジータ、ルリア"},
  {"label":"古戦場は参加してる？","placeholder":"例：毎回全力で貢献してる"},
  {"label":"グラブルの魅力を一言","placeholder":"例：長年の積み重ねが報われるゲーム"}
]'),

('プロジェクトセカイ（プロセカ）', array['アニメ・ゲーム','ソシャゲ・RPG'], '[
  {"label":"プロセカ歴は？","placeholder":"例：リリースから"},
  {"label":"推しユニットは？","placeholder":"例：Leo/need、MORE MORE JUMP！"},
  {"label":"推しキャラは？","placeholder":"例：天馬咲希、朝比奈まふゆ"},
  {"label":"スコアランクはどのくらい？","placeholder":"例：APを目指してる"},
  {"label":"ボカロ曲の好きな曲は？","placeholder":"例：「アンチグラビティガール」「ロストワンの号哭」"},
  {"label":"プロセカの魅力を一言","placeholder":"例：ボカロ文化とオリジナルキャラの融合"}
]'),

('あんさんぶるスターズ（あんスタ）', array['アニメ・ゲーム','ソシャゲ・RPG'], '[
  {"label":"あんスタ歴は？","placeholder":"例：初期から"},
  {"label":"推しユニットは？","placeholder":"例：fine、Knights"},
  {"label":"推しキャラは？","placeholder":"例：天満光、朱桜司"},
  {"label":"ライブに行ったことある？","placeholder":"例：あんスタエクスト行った"},
  {"label":"あんスタの魅力を一言","placeholder":"例：キャラの深みとユニット同士の関係性"}
]'),

('アイドルマスター', array['アニメ・ゲーム','ソシャゲ・RPG'], '[
  {"label":"アイマス歴は？","placeholder":"例：765プロ時代から"},
  {"label":"好きなブランドは？","placeholder":"例：シャニマス、ミリシタ、シンデレラ"},
  {"label":"推しアイドルは？","placeholder":"例：天海春香、風野灯織"},
  {"label":"ライブに行ったことある？","placeholder":"例：THE IDOLM@STER LIVE行った"},
  {"label":"アイマスの魅力を一言","placeholder":"例：プロデューサーとアイドルの物語"}
]'),

('ポケモン', array['アニメ・ゲーム','ソシャゲ・RPG'], '[
  {"label":"ポケモン歴は？","placeholder":"例：赤緑から"},
  {"label":"好きな世代は？","placeholder":"例：第2世代、第4世代"},
  {"label":"推しポケモンは？","placeholder":"例：ゲンガー、リザードン"},
  {"label":"対戦はやる？","placeholder":"例：シングル対戦やってる、育成専門"},
  {"label":"ポケモンGOはやってる？","placeholder":"例：毎日歩いてる"},
  {"label":"ポケモンの魅力を一言","placeholder":"例：集める・育てる・戦う全部が楽しい"}
]'),

('ドラゴンクエスト（ドラクエ）', array['アニメ・ゲーム','ソシャゲ・RPG'], '[
  {"label":"ドラクエ歴は？","placeholder":"例：DQ3発売日に並んだ"},
  {"label":"好きなナンバリングは？","placeholder":"例：DQ5、DQ11"},
  {"label":"推しキャラ・仲間は？","placeholder":"例：ビアンカ or フローラ論争"},
  {"label":"ビアンカとフローラ、どっちを選んだ？","placeholder":"例：ビアンカ一択"},
  {"label":"ドラクエの魅力を一言","placeholder":"例：日本のRPGの原点にして頂点"}
]'),

('ファイナルファンタジー（FF）', array['アニメ・ゲーム','ソシャゲ・RPG'], '[
  {"label":"FF歴は？","placeholder":"例：FF6から"},
  {"label":"好きなナンバリングは？","placeholder":"例：FF7、FF10"},
  {"label":"推しキャラは？","placeholder":"例：クラウド、ティーダ、ライトニング"},
  {"label":"FFのどの要素が好き？","placeholder":"例：音楽（植松伸夫）が大好き"},
  {"label":"FF7リメイクシリーズについてどう思う？","placeholder":"例：賛否あるけど好き"},
  {"label":"FFの魅力を一言","placeholder":"例：毎回全力で新しいことに挑む姿勢"}
]'),

('モンスターハンター（モンハン）', array['アニメ・ゲーム','ソシャゲ・RPG'], '[
  {"label":"モンハン歴は？","placeholder":"例：初代PSPから"},
  {"label":"好きな武器種は？","placeholder":"例：双剣、大剣、太刀"},
  {"label":"一番好きなモンスターは？","placeholder":"例：ナルガクルガ、ティガレックス"},
  {"label":"ソロ派 or マルチ派？","placeholder":"例：基本ソロで詰まったらマルチ"},
  {"label":"モンハンワールド・アイスボーンについて","placeholder":"例：シリーズ最高傑作だと思う"},
  {"label":"モンハンの魅力を一言","placeholder":"例：狩りの達成感と装備強化の中毒性"}
]'),

('モンスト（モンスターストライク）', array['アニメ・ゲーム','ソシャゲ・RPG'], '[
  {"label":"モンスト歴は？","placeholder":"例：リリース初期から"},
  {"label":"今もアクティブにやってる？","placeholder":"例：毎日やってる"},
  {"label":"推しキャラは？","placeholder":"例：ランスロット、ノストラダムス"},
  {"label":"マルチ派 or ソロ派？","placeholder":"例：友達とマルチが楽しい"},
  {"label":"モンストの魅力を一言","placeholder":"例：リアルで友達と集まって遊べる"}
]');

-- ============================================================
-- [16] ゲーム > Nintendo（5）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('マリオシリーズ', array['アニメ・ゲーム','Nintendo'], '[
  {"label":"マリオ歴は？","placeholder":"例：スーパーマリオブラザーズから"},
  {"label":"一番好きなタイトルは？","placeholder":"例：マリオ64、オデッセイ"},
  {"label":"マリオカートはやる？","placeholder":"例：マリカー8Dは今でも現役"},
  {"label":"マリオパーティのトラウマは？","placeholder":"例：友達と絶縁しかけた"},
  {"label":"マリオの魅力を一言","placeholder":"例：世代を超えて遊べる任天堂の象徴"}
]'),

('大乱闘スマッシュブラザーズ', array['アニメ・ゲーム','Nintendo'], '[
  {"label":"スマブラ歴は？","placeholder":"例：64から"},
  {"label":"メインキャラは？","placeholder":"例：マルス、ピカチュウ"},
  {"label":"対戦スタイルは？","placeholder":"例：ガチ対戦派、わいわいパーティ派"},
  {"label":"VIPマッチは行けてる？","placeholder":"例：ガチ勢ではないが楽しんでる"},
  {"label":"スマブラの魅力を一言","placeholder":"例：ゲームの歴史が全員集合する夢の舞台"}
]'),

('ゼルダの伝説', array['アニメ・ゲーム','Nintendo'], '[
  {"label":"ゼルダ歴は？","placeholder":"例：神々のトライフォースから"},
  {"label":"一番好きなタイトルは？","placeholder":"例：ブレスオブザワイルド、時のオカリナ"},
  {"label":"ブレワイ・ティアキンはクリアした？","placeholder":"例：祠コンプしてる"},
  {"label":"ゼルダのどこが好き？","placeholder":"例：謎解きと世界観の没入感"},
  {"label":"ゼルダの魅力を一言","placeholder":"例：冒険するとはこういうことを教えてくれる"}
]'),

('どうぶつの森', array['アニメ・ゲーム','Nintendo'], '[
  {"label":"どう森歴は？","placeholder":"例：コロナ禍のあつ森から"},
  {"label":"一番遊んだタイトルは？","placeholder":"例：あつまれどうぶつの森"},
  {"label":"好きな住民は？","placeholder":"例：ゆきみ、しずえさん"},
  {"label":"島のテーマは？","placeholder":"例：和風庭園をイメージしてる"},
  {"label":"どう森の魅力を一言","placeholder":"例：ゆっくり時間が流れる癒しの世界"}
]'),

('カービィシリーズ', array['アニメ・ゲーム','Nintendo'], '[
  {"label":"カービィ歴は？","placeholder":"例：星のカービィ初代から"},
  {"label":"好きなタイトルは？","placeholder":"例：星のカービィ64、ロボボプラネット"},
  {"label":"好きなコピー能力は？","placeholder":"例：ソード、ファイア"},
  {"label":"カービィの魅力を一言","placeholder":"例：見た目のかわいさと実は深いシナリオ"}
]');

-- ============================================================
-- [17] ゲーム > 対戦・FPS（7）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('Apex Legends', array['アニメ・ゲーム','対戦・FPS'], '[
  {"label":"Apex歴は？","placeholder":"例：シーズン1から"},
  {"label":"ランクはどのくらい？","placeholder":"例：プラチナ、ダイヤ、マスター"},
  {"label":"メインレジェンドは？","placeholder":"例：ライフライン、ローバ"},
  {"label":"プレイスタイルは？","placeholder":"例：ソロランク、フレンドとトリオ"},
  {"label":"得意な距離は？","placeholder":"例：中距離、近接"},
  {"label":"好きな武器は？","placeholder":"例：R-301、ボルトSMG"},
  {"label":"Apexの魅力を一言","placeholder":"例：動きの気持ちよさとチームプレイの爽快感"}
]'),

('VALORANT', array['アニメ・ゲーム','対戦・FPS'], '[
  {"label":"VALORANT歴は？","placeholder":"例：リリースから"},
  {"label":"ランクはどのくらい？","placeholder":"例：ゴールド、プラチナ、ダイヤ"},
  {"label":"メインエージェントは？","placeholder":"例：ジェット、セージ、レイナ"},
  {"label":"ロール（役割）は？","placeholder":"例：デュエリスト、センチネル"},
  {"label":"好きなマップは？","placeholder":"例：バインド、サンセット"},
  {"label":"VALORANTの魅力を一言","placeholder":"例：戦術とエイムの総合力が試される"}
]'),

('フォートナイト', array['アニメ・ゲーム','対戦・FPS'], '[
  {"label":"フォートナイト歴は？","placeholder":"例：チャプター1から"},
  {"label":"バトロワ派 or クリエイティブ派？","placeholder":"例：バトロワ一択"},
  {"label":"ビクロイは出せてる？","placeholder":"例：たまに出せる"},
  {"label":"好きなコラボスキンは？","placeholder":"例：マーベル系が好き"},
  {"label":"フォートナイトの魅力を一言","placeholder":"例：建築とバトルの組み合わせが唯一無二"}
]'),

('スプラトゥーン', array['アニメ・ゲーム','対戦・FPS'], '[
  {"label":"スプラ歴は？","placeholder":"例：初代Wii Uから"},
  {"label":"ウデマエはどのくらい？","placeholder":"例：X帯、S+"},
  {"label":"好きなブキ種は？","placeholder":"例：シューター、ローラー、チャージャー"},
  {"label":"ガチマッチ派 or ナワバリ派？","placeholder":"例：ガチマッチで上を目指してる"},
  {"label":"スプラのここが好き！","placeholder":"例：塗るという発想とカラフルな世界観"}
]'),

('マインクラフト（マイクラ）', array['アニメ・ゲーム','対戦・FPS'], '[
  {"label":"マイクラ歴は？","placeholder":"例：Java版ベータから"},
  {"label":"プレイスタイルは？","placeholder":"例：サバイバル建築派、クリエイティブ派"},
  {"label":"一番こだわった建築は？","placeholder":"例：地下都市、お城"},
  {"label":"マルチサーバーは入ってる？","placeholder":"例：友達とサーバー立ててる"},
  {"label":"マイクラの魅力を一言","placeholder":"例：限界がない創造の自由度"}
]'),

('League of Legends（LoL）', array['アニメ・ゲーム','対戦・FPS'], '[
  {"label":"LoL歴は？","placeholder":"例：シーズン3から"},
  {"label":"ランクはどのくらい？","placeholder":"例：ゴールド、プラチナ"},
  {"label":"メインロールは？","placeholder":"例：ADC、ジャングル、サポート"},
  {"label":"メインチャンピオンは？","placeholder":"例：ルシアン、ヤスオ"},
  {"label":"LJL（日本リーグ）は見てる？","placeholder":"例：DetonatioN FocusMeを応援してる"},
  {"label":"LoLの魅力を一言","placeholder":"例：頭と反射神経の総合格闘技"}
]'),

('ストリートファイター', array['アニメ・ゲーム','対戦・FPS'], '[
  {"label":"スト歴は？","placeholder":"例：スーファミのスパ2から"},
  {"label":"好きなナンバリングは？","placeholder":"例：スト3、スト5、スト6"},
  {"label":"メインキャラは？","placeholder":"例：リュウ、春麗、ガイル"},
  {"label":"ランクはどのくらい？","placeholder":"例：スト6でマスター"},
  {"label":"格ゲーのここが好き！","placeholder":"例：1on1の純粋な実力勝負"},
  {"label":"格ゲーの魅力を一言","placeholder":"例：対戦格闘ゲームの原点"}
]');

-- ============================================================
-- [18] ライフスタイル・エンタメ > お笑い（12）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('サンドウィッチマン', array['ライフスタイル・エンタメ','お笑い'], '[
  {"label":"サンドウィッチマンを好きになったのは？","placeholder":"例：M-1 2007の復活当日から"},
  {"label":"好きなコントは？","placeholder":"例：ピザのコント、ファミレスのコント"},
  {"label":"富澤と伊達、どっちが好き？","placeholder":"例：どっちも好きだけど富澤のずっこけが好き"},
  {"label":"ライブに行ったことある？","placeholder":"例：単独ライブに行った"},
  {"label":"東北絆大使としての活動についてひとこと","placeholder":"例：それも含めて好き"},
  {"label":"サンドの魅力を一言","placeholder":"例：安定感と品の良さが日本一"}
]'),

('オードリー', array['ライフスタイル・エンタメ','お笑い'], '[
  {"label":"オードリーを好きになったのは？","placeholder":"例：M-1 2008のハネ馬場から"},
  {"label":"好きなコントは？","placeholder":"例：若林の陰キャコント、春日のドヤ顔"},
  {"label":"若林と春日、どっちが好き？","placeholder":"例：若林の内面に共感する"},
  {"label":"ANN（オールナイトニッポン）は聴いてる？","placeholder":"例：毎週欠かさず聴いてる"},
  {"label":"武道館ライブは行った？","placeholder":"例：当選して行けた"},
  {"label":"オードリーの魅力を一言","placeholder":"例：若林の本音トークとラジオへの愛"}
]'),

('霜降り明星', array['ライフスタイル・エンタメ','お笑い'], '[
  {"label":"霜降りを好きになったのは？","placeholder":"例：M-1 2018の優勝で"},
  {"label":"好きなネタは？","placeholder":"例：粗品のボケのスピードが好き"},
  {"label":"粗品とせいや、どっちが好き？","placeholder":"例：粗品のひねくれ感が好き"},
  {"label":"ラジオ・YouTube・SNSどれで見てる？","placeholder":"例：YouTubeチャンネルを毎日見てる"},
  {"label":"霜降りの魅力を一言","placeholder":"例：天才粗品の頭の回転の速さ"}
]'),

('かまいたち', array['ライフスタイル・エンタメ','お笑い'], '[
  {"label":"かまいたちを好きになったのは？","placeholder":"例：M-1 2017から"},
  {"label":"好きなコントは？","placeholder":"例：「ゾンビ」「キャバ嬢」"},
  {"label":"山内と濱家、どっちが好き？","placeholder":"例：山内の声のトーンが好き"},
  {"label":"かまいたちのここが好き！","placeholder":"例：コントの完成度が異次元"},
  {"label":"かまいたちの魅力を一言","placeholder":"例：漫才もコントも両方できる"}
]'),

('令和ロマン', array['ライフスタイル・エンタメ','お笑い'], '[
  {"label":"令和ロマンを好きになったのは？","placeholder":"例：M-1 2023で衝撃を受けた"},
  {"label":"好きなネタは？","placeholder":"例：M-1決勝のネタ"},
  {"label":"くるまとひろと、どっちが好き？","placeholder":"例：くるまの頭の良さに惚れた"},
  {"label":"ラジオは聴いてる？","placeholder":"例：ANN0を毎週聴いてる"},
  {"label":"令和ロマンの魅力を一言","placeholder":"例：M-1連覇という前人未到の快挙"}
]'),

('ミルクボーイ', array['ライフスタイル・エンタメ','お笑い'], '[
  {"label":"ミルクボーイを好きになったのは？","placeholder":"例：M-1 2019で100点超えたのを見て"},
  {"label":"コーンフレークのネタについてひとこと","placeholder":"例：構造の美しさに感動した"},
  {"label":"内海と駒場、どっちが好き？","placeholder":"例：内海のトーンが好き"},
  {"label":"ミルクボーイの魅力を一言","placeholder":"例：漫才の定石を完璧に極めた"}
]'),

('バナナマン', array['ライフスタイル・エンタメ','お笑い'], '[
  {"label":"バナナマンを好きになったのは？","placeholder":"例：ラジオで知って"},
  {"label":"バナナマンのここが好き！","placeholder":"例：コントの質と設楽のメタ視点"},
  {"label":"設楽と日村、どっちが好き？","placeholder":"例：日村の愛されキャラが好き"},
  {"label":"バナナムーンGOLDは聴いてる？","placeholder":"例：20年近く毎週聴いてる"},
  {"label":"バナナマンの魅力を一言","placeholder":"例：コントへのこだわりと長年の信頼感"}
]'),

('ニューヨーク', array['ライフスタイル・エンタメ','お笑い'], '[
  {"label":"ニューヨークを好きになったのは？","placeholder":"例：キングオブコントで"},
  {"label":"好きなコントは？","placeholder":"例：ゴシップや炎上を扱ったネタ"},
  {"label":"屋敷と嶋佐、どっちが好き？","placeholder":"例：屋敷の毒舌が好き"},
  {"label":"ニューヨークの魅力を一言","placeholder":"例：毒があるのに後味が悪くない"}
]'),

('ナイツ', array['ライフスタイル・エンタメ','お笑い'], '[
  {"label":"ナイツを好きになったのは？","placeholder":"例：漫才のうんちく漫才を見て"},
  {"label":"塙と土屋、どっちが好き？","placeholder":"例：塙の「ヤホーで調べたんですけど」"},
  {"label":"お笑いの知識はある？","placeholder":"例：ナイツのせいでM-1の歴史に詳しくなった"},
  {"label":"ナイツの魅力を一言","placeholder":"例：言葉遊びの職人技"}
]'),

('錦鯉', array['ライフスタイル・エンタメ','お笑い'], '[
  {"label":"錦鯉を好きになったのは？","placeholder":"例：M-1 2021で長谷川さんを見て"},
  {"label":"長谷川と渡辺、どっちが好き？","placeholder":"例：長谷川さんの全力バカが好き"},
  {"label":"錦鯉のここが好き！","placeholder":"例：50歳で夢を掴んだストーリー"},
  {"label":"錦鯉の魅力を一言","placeholder":"例：諦めなければ夢は叶うを証明してる"}
]'),

('バカリズム', array['ライフスタイル・エンタメ','お笑い'], '[
  {"label":"バカリズムを好きになったのは？","placeholder":"例：ピン芸時代のMr.ニューヨークから"},
  {"label":"バカリズムのここが好き！","placeholder":"例：脚本・演技・芸すべてできる唯一の存在"},
  {"label":"好きな作品・ネタは？","placeholder":"例：「都道府県の持ちかた」「升野、お前が都会か！」"},
  {"label":"脚本家としてのバカリズムについてひとこと","placeholder":"例：「架空OL日記」は天才の仕事"},
  {"label":"バカリズムの魅力を一言","placeholder":"例：芸人・脚本家・俳優の三刀流"}
]'),

('有吉弘行', array['ライフスタイル・エンタメ','お笑い'], '[
  {"label":"有吉を好きになったのは？","placeholder":"例：猿岩石時代、復活後のあだ名芸で"},
  {"label":"有吉弘行のここが好き！","placeholder":"例：毒舌なのに愛があるバランス感覚"},
  {"label":"好きなMCの番組は？","placeholder":"例：有吉の壁、マツコと有吉の怒り新党"},
  {"label":"ラジオ（有吉ANN）は聴いてる？","placeholder":"例：毎週聴いてた"},
  {"label":"有吉の魅力を一言","placeholder":"例：どん底からの復活と磨かれた毒舌"}
]');

-- ============================================================
-- [19] ライフスタイル・エンタメ > ラジオ、役者・声優、小説家
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('深夜ラジオ（オールナイトニッポン等）', array['ライフスタイル・エンタメ','ラジオ'], '[
  {"label":"深夜ラジオ歴は？","placeholder":"例：高校生の頃から聴いてる"},
  {"label":"好きな番組・パーソナリティは？","placeholder":"例：オードリーANN、霜降りANN0"},
  {"label":"どうやって聴いてる？","placeholder":"例：radiko、Spotify"},
  {"label":"ラジオの魅力を一言","placeholder":"例：テレビでは見せない本音が聴ける"},
  {"label":"ラジオきっかけで好きになったアーティスト・芸人は？","placeholder":"例：ラジオでバナナマンが好きになった"}
]'),

-- 役者
('菅田将暉', array['ライフスタイル・エンタメ','役者'], '[
  {"label":"菅田将暉を好きになったのは？","placeholder":"例：「あの頃、君を追いかけた」で"},
  {"label":"好きな出演作は？","placeholder":"例：「花束みたいな恋をした」「糸」"},
  {"label":"音楽活動も好き？","placeholder":"例：「まちがいさがし」が刺さった"},
  {"label":"菅田将暉の魅力を一言","placeholder":"例：役によって全然違う顔を見せる天才"}
]'),

('吉沢亮', array['ライフスタイル・エンタメ','役者'], '[
  {"label":"吉沢亮を好きになったのは？","placeholder":"例：「僕のヒーローアカデミア」「青天を衝け」で"},
  {"label":"好きな出演作は？","placeholder":"例：「キングダム」「青天を衝け」"},
  {"label":"吉沢亮の魅力を一言","placeholder":"例：眼力とビジュアルと演技力"}
]'),

('山崎賢人', array['ライフスタイル・エンタメ','役者'], '[
  {"label":"山崎賢人を好きになったのは？","placeholder":"例：「キングダム」で"},
  {"label":"好きな出演作は？","placeholder":"例：「キングダム」「オオカミ少女と黒王子」"},
  {"label":"山崎賢人の魅力を一言","placeholder":"例：スタイルとアクションの説得力"}
]'),

('竹内涼真', array['ライフスタイル・エンタメ','役者'], '[
  {"label":"竹内涼真を好きになったのは？","placeholder":"例：「下克上受験」「陸王」で"},
  {"label":"好きな出演作は？","placeholder":"例：「陸王」「花のち晴れ」"},
  {"label":"竹内涼真の魅力を一言","placeholder":"例：爽やかさの中の男らしさ"}
]'),

('松坂桃李', array['ライフスタイル・エンタメ','役者'], '[
  {"label":"松坂桃李を好きになったのは？","placeholder":"例：「娼年」「孤狼の血」で"},
  {"label":"好きな出演作は？","placeholder":"例：「孤狼の血」「砕け散るところを見せてあげる」"},
  {"label":"松坂桃李の魅力を一言","placeholder":"例：ギャップのある演技の振れ幅"}
]'),

('新垣結衣', array['ライフスタイル・エンタメ','役者'], '[
  {"label":"ガッキーを好きになったのは？","placeholder":"例：「コードブルー」「逃げ恥」で"},
  {"label":"好きな出演作は？","placeholder":"例：「逃げるは恥だが役に立つ」「問題のあるレストラン」"},
  {"label":"新垣結衣の魅力を一言","placeholder":"例：存在感と演技の自然さが唯一無二"}
]'),

('浜辺美波', array['ライフスタイル・エンタメ','役者'], '[
  {"label":"浜辺美波を好きになったのは？","placeholder":"例：「咲-Saki-」「アリスと蔵六」で"},
  {"label":"好きな出演作は？","placeholder":"例：「シン・仮面ライダー」「中学聖日記」"},
  {"label":"浜辺美波の魅力を一言","placeholder":"例：透き通るようなビジュアルと確かな演技力"}
]'),

('石原さとみ', array['ライフスタイル・エンタメ','役者'], '[
  {"label":"石原さとみを好きになったのは？","placeholder":"例：「Ns''あおい」「失恋ショコラティエ」で"},
  {"label":"好きな出演作は？","placeholder":"例：「地味にスゴイ!」「アンナチュラル」"},
  {"label":"石原さとみの魅力を一言","placeholder":"例：コミカルからシリアスまで幅広い"}
]'),

('広瀬すず', array['ライフスタイル・エンタメ','役者'], '[
  {"label":"広瀬すずを好きになったのは？","placeholder":"例：「海街diary」「陸王」で"},
  {"label":"好きな出演作は？","placeholder":"例：「anone」「さんかく窓の外側は夜」"},
  {"label":"広瀬すずの魅力を一言","placeholder":"例：天然の存在感と自然体の演技"}
]'),

('橋本環奈', array['ライフスタイル・エンタメ','役者'], '[
  {"label":"橋本環奈を好きになったのは？","placeholder":"例：「千年に一人の美少女」がバズって"},
  {"label":"好きな出演作は？","placeholder":"例：「シンデレラ」「今日から俺は！！」"},
  {"label":"橋本環奈の魅力を一言","placeholder":"例：アイドル出身なのにコメディもシリアスもできる"}
]'),

('声優好き（全般）', array['ライフスタイル・エンタメ','役者'], '[
  {"label":"声優に興味を持ったのは？","placeholder":"例：アニメを見ていて声に惚れた"},
  {"label":"好きな声優は？","placeholder":"例：花澤香菜、梶裕貴"},
  {"label":"声優のどんな仕事が好き？","placeholder":"例：アニメ・ゲーム・ラジオ"},
  {"label":"ライブ・イベントに行ったことある？","placeholder":"例：アニメイベントに年1〜2回"},
  {"label":"声優の魅力を一言","placeholder":"例：声だけで感情を動かせる技術"}
]'),

('韓国俳優・ドラマ', array['ライフスタイル・エンタメ','役者'], '[
  {"label":"韓国ドラマを見始めたのは？","placeholder":"例：「愛の不時着」でハマった"},
  {"label":"好きな俳優・女優は？","placeholder":"例：ヒョンビン、ソン・イェジン"},
  {"label":"好きな作品は？","placeholder":"例：「愛の不時着」「梨泰院クラス」「イカゲーム」"},
  {"label":"韓国語を勉強してる？","placeholder":"例：ドラマきっかけで勉強中"},
  {"label":"韓国ドラマの魅力を一言","placeholder":"例：感情の振れ幅と展開の速さが最高"}
]');

-- 小説家
insert into memoria.template_nodes (name, path, questions) values

('東野圭吾', array['ライフスタイル・エンタメ','小説家'], '[
  {"label":"東野圭吾を読み始めたのは？","placeholder":"例：「容疑者Xの献身」で"},
  {"label":"好きな作品は？","placeholder":"例：「白夜行」「容疑者Xの献身」「ナミヤ雑貨店」"},
  {"label":"ガリレオシリーズと加賀恭一郎シリーズ、どっちが好き？","placeholder":"例：加賀シリーズの方が好き"},
  {"label":"東野圭吾の魅力を一言","placeholder":"例：読み始めたら絶対止まらない"}
]'),

('村上春樹', array['ライフスタイル・エンタメ','小説家'], '[
  {"label":"村上春樹を読み始めたのは？","placeholder":"例：「ノルウェイの森」で"},
  {"label":"好きな作品は？","placeholder":"例：「ノルウェイの森」「海辺のカフカ」「1Q84」"},
  {"label":"短編と長編、どっちが好き？","placeholder":"例：長編の没入感が好き"},
  {"label":"村上春樹の魅力を一言","placeholder":"例：孤独と音楽と猫と不思議な世界観"}
]'),

('伊坂幸太郎', array['ライフスタイル・エンタメ','小説家'], '[
  {"label":"伊坂幸太郎を読み始めたのは？","placeholder":"例：「アヒルと鴨のコインロッカー」で"},
  {"label":"好きな作品は？","placeholder":"例：「ゴールデンスランバー」「重力ピエロ」「マリアビートル」"},
  {"label":"伏線回収の気持ちよさについてひとこと","placeholder":"例：鳥肌が立つ瞬間がある"},
  {"label":"伊坂幸太郎の魅力を一言","placeholder":"例：読後感が爽快、仙台への愛も好き"}
]'),

('池井戸潤', array['ライフスタイル・エンタメ','小説家'], '[
  {"label":"池井戸潤を読み始めたのは？","placeholder":"例：「下町ロケット」のドラマから"},
  {"label":"好きな作品は？","placeholder":"例：「半沢直樹」「下町ロケット」「陸王」"},
  {"label":"半沢直樹のあの名台詞といえば？","placeholder":"例：「倍返しだ！」"},
  {"label":"池井戸潤の魅力を一言","placeholder":"例：サラリーマンの溜飲が下がる爽快感"}
]'),

('京極夏彦', array['ライフスタイル・エンタメ','小説家'], '[
  {"label":"京極夏彦を読み始めたのは？","placeholder":"例：「姑獲鳥の夏」で"},
  {"label":"好きな作品は？","placeholder":"例：「魍魎の匣」「絡新婦の理」"},
  {"label":"分厚い本への耐性は？","placeholder":"例：文庫本を自炊してKindleで読んでる"},
  {"label":"京極夏彦の魅力を一言","placeholder":"例：分厚さと知識量が魅力、読後の充実感"}
]'),

('湊かなえ', array['ライフスタイル・エンタメ','小説家'], '[
  {"label":"湊かなえを読み始めたのは？","placeholder":"例：「告白」で"},
  {"label":"好きな作品は？","placeholder":"例：「告白」「往復書簡」「花の鎖」"},
  {"label":"イヤミスの感想は？","placeholder":"例：読後にどんよりするのがいい"},
  {"label":"湊かなえの魅力を一言","placeholder":"例：人間の嫌な部分を描く技術が唯一無二"}
]'),

('辻村深月', array['ライフスタイル・エンタメ','小説家'], '[
  {"label":"辻村深月を読み始めたのは？","placeholder":"例：「ぼくのメジャースプーン」で"},
  {"label":"好きな作品は？","placeholder":"例：「ゼロ、ハチ、ゼロ、ナナ。」「かがみの孤城」"},
  {"label":"作品同士のつながりについてどう思う？","placeholder":"例：読み進めるほど伏線が繋がって感動"},
  {"label":"辻村深月の魅力を一言","placeholder":"例：子供と大人の心に同時に刺さる"}
]'),

('宮部みゆき', array['ライフスタイル・エンタメ','小説家'], '[
  {"label":"宮部みゆきを読み始めたのは？","placeholder":"例：「火車」「模倣犯」で"},
  {"label":"好きな作品は？","placeholder":"例：「火車」「ソロモンの偽証」「三島屋変調百物語」"},
  {"label":"現代ミステリーと時代小説、どっちが好き？","placeholder":"例：現代ものの方が好き"},
  {"label":"宮部みゆきの魅力を一言","placeholder":"例：人情と社会への鋭い眼差し"}
]'),

('角田光代', array['ライフスタイル・エンタメ','小説家'], '[
  {"label":"角田光代を読み始めたのは？","placeholder":"例：「八日目の蝉」で"},
  {"label":"好きな作品は？","placeholder":"例：「八日目の蝉」「対岸の彼女」「坂の途中の家」"},
  {"label":"角田光代の魅力を一言","placeholder":"例：女性の複雑な感情をここまで描ける人はいない"}
]'),

('小川洋子', array['ライフスタイル・エンタメ','小説家'], '[
  {"label":"小川洋子を読み始めたのは？","placeholder":"例：「博士の愛した数式」で"},
  {"label":"好きな作品は？","placeholder":"例：「博士の愛した数式」「密やかな結晶」"},
  {"label":"小川洋子の世界観についてひとこと","placeholder":"例：静かで美しい、独特の時間が流れる"},
  {"label":"小川洋子の魅力を一言","placeholder":"例：繊細な文章で描く世界に迷い込める"}
]');

-- ============================================================
-- [20] ライフスタイル > グルメ・嗜好品・アウトドア・日常交流
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('ラーメン巡り', array['ライフスタイル・エンタメ','グルメ・嗜好品'], '[
  {"label":"ラーメン歴は？","placeholder":"例：学生の頃から全国を食べ歩き"},
  {"label":"好きな系統は？","placeholder":"例：家系、二郎系、淡麗醤油"},
  {"label":"今一番好きなラーメン屋は？","placeholder":"例：まだ内緒（通い続けたい）"},
  {"label":"食べ歩きしたことのある都市は？","placeholder":"例：東京・大阪・博多はひととおり"},
  {"label":"ラーメンの魅力を一言","placeholder":"例：一杯に作り手の哲学が詰まってる"}
]'),

('カフェ・スイーツ', array['ライフスタイル・エンタメ','グルメ・嗜好品'], '[
  {"label":"カフェ・スイーツ好き歴は？","placeholder":"例：高校生の頃から"},
  {"label":"好きなコーヒーは？","placeholder":"例：エチオピア豆のフルーティーな浅煎り"},
  {"label":"最近行ってよかったカフェは？","placeholder":"例：まだ内緒"},
  {"label":"スイーツで一番好きなものは？","placeholder":"例：プリン、ショートケーキ"},
  {"label":"カフェ巡りの魅力を一言","placeholder":"例：空間と時間を一緒に買える体験"}
]'),

('激辛フード', array['ライフスタイル・エンタメ','グルメ・嗜好品'], '[
  {"label":"辛さ耐性は？","placeholder":"例：辛さ10倍でも余裕"},
  {"label":"好きな激辛料理は？","placeholder":"例：マーラーホットポット、辛ラーメン10袋"},
  {"label":"限界を超えた経験は？","placeholder":"例：蒙古タンメン北極で倒れかけた"},
  {"label":"激辛の魅力を一言","placeholder":"例：限界を超えた時の達成感"}
]'),

('お酒（居酒屋・クラフトビール・日本酒など）', array['ライフスタイル・エンタメ','グルメ・嗜好品'], '[
  {"label":"お酒歴は？","placeholder":"例：成人してすぐビール好きに"},
  {"label":"好きなお酒の種類は？","placeholder":"例：クラフトビール、日本酒の純米吟醸"},
  {"label":"好きな居酒屋スタイルは？","placeholder":"例：角打ち、立ち飲み、焼き鳥屋"},
  {"label":"家飲み派 or 外飲み派？","placeholder":"例：外で一杯が好き"},
  {"label":"お酒の魅力を一言","placeholder":"例：お酒は人をつなぐ"}
]'),

('シーシャ（水タバコ）', array['ライフスタイル・エンタメ','グルメ・嗜好品'], '[
  {"label":"シーシャを始めたのは？","placeholder":"例：友人に誘われて"},
  {"label":"好きなフレーバーは？","placeholder":"例：ダブルアップル、ミント系"},
  {"label":"よく行くシーシャ屋は？","placeholder":"例：まだ内緒"},
  {"label":"シーシャの魅力を一言","placeholder":"例：ゆっくり時間を過ごせる空間"}
]'),

('サウナ（サ活）', array['ライフスタイル・エンタメ','アウトドア・お出かけ'], '[
  {"label":"サ活歴は？","placeholder":"例：コロナ禍から沼にはまった"},
  {"label":"好きなサウナは？","placeholder":"例：まだ内緒（激戦区なので）"},
  {"label":"ととのった体験を一言","placeholder":"例：外気浴でみている景色が宇宙になった"},
  {"label":"サウナのルーティンは？","placeholder":"例：12分→水風呂2分→外気浴10分を3セット"},
  {"label":"サ友は募集してる？","placeholder":"例：一緒に行ってくれる人大歓迎"},
  {"label":"サウナの魅力を一言","placeholder":"例：整う感覚は体験した人にしかわからない"}
]'),

('キャンプ・BBQ', array['ライフスタイル・エンタメ','アウトドア・お出かけ'], '[
  {"label":"キャンプ歴は？","placeholder":"例：ソロキャンプ始めて3年"},
  {"label":"ソロキャン派 or グループ派？","placeholder":"例：ソロキャンで自由を楽しむ"},
  {"label":"好きなキャンプ場は？","placeholder":"例：まだ内緒"},
  {"label":"こだわりのギアは？","placeholder":"例：スノーピークのテント一択"},
  {"label":"キャンプでの飯テロを一言","placeholder":"例：炭火で焼いた肉は最高"},
  {"label":"キャンプの魅力を一言","placeholder":"例：非日常と自然の中で充電できる"}
]'),

('ドライブ・旅行', array['ライフスタイル・エンタメ','アウトドア・お出かけ'], '[
  {"label":"旅行歴は？","placeholder":"例：年5〜6回は行く"},
  {"label":"好きな旅のスタイルは？","placeholder":"例：ドライブで気まま旅"},
  {"label":"今まで行ったなかで一番よかった場所は？","placeholder":"例：屋久島、沖縄"},
  {"label":"ドライブの時のお供は？","placeholder":"例：プレイリストを作り込む"},
  {"label":"次に行きたい場所は？","placeholder":"例：まだ計画中"},
  {"label":"旅の魅力を一言","placeholder":"例：知らない場所で知らない自分を発見できる"}
]'),

('ディズニー・USJ', array['ライフスタイル・エンタメ','アウトドア・お出かけ'], '[
  {"label":"ディズニー・USJ歴は？","placeholder":"例：毎年必ず行く"},
  {"label":"ディズニー派 or USJ派？","placeholder":"例：ディズニー一択、USJも行く"},
  {"label":"好きなエリア・アトラクションは？","placeholder":"例：ファンタジーランド、ハリポタエリア"},
  {"label":"年何回行く？","placeholder":"例：年3〜4回"},
  {"label":"推しキャラは？","placeholder":"例：ダッフィー、ミニー"},
  {"label":"ディズニー・USJの魅力を一言","placeholder":"例：夢の世界に本当に入れる"}
]'),

('筋トレ・フィットネス', array['ライフスタイル・エンタメ','アウトドア・お出かけ'], '[
  {"label":"筋トレ歴は？","placeholder":"例：2年前から週3でジムに行ってる"},
  {"label":"好きな種目は？","placeholder":"例：ベンチプレス、デッドリフト"},
  {"label":"今の目標は？","placeholder":"例：ベンチ100kg"},
  {"label":"食事管理はしてる？","placeholder":"例：タンパク質を毎食意識してる"},
  {"label":"トレーニングのモチベ維持の方法は？","placeholder":"例：Instagramで記録を公開してる"},
  {"label":"筋トレの魅力を一言","placeholder":"例：自分を裏切らない達成感"}
]'),

('YouTuber好き', array['ライフスタイル・エンタメ','アウトドア・お出かけ'], '[
  {"label":"YouTubeを本格的に見始めたのは？","placeholder":"例：ヒカキンが有名になった頃から"},
  {"label":"好きなYouTuberは？","placeholder":"例：ヒカキン、はじめしゃちょー、フィッシャーズ"},
  {"label":"よく見るジャンルは？","placeholder":"例：ドッキリ、企画、Vlog"},
  {"label":"YouTube Premiumは入ってる？","placeholder":"例：入ってる、広告なしは快適"},
  {"label":"最近ハマってるチャンネルは？","placeholder":"例：まだ内緒"},
  {"label":"YouTuberの魅力を一言","placeholder":"例：テレビにない自由な発信が好き"}
]');

-- 日常・交流
insert into memoria.template_nodes (name, path, questions) values

('街コン・婚活', array['ライフスタイル・エンタメ','日常・交流'], '[
  {"label":"婚活歴は？","placeholder":"例：アプリを半年、街コンに5回"},
  {"label":"どんな出会いを探してる？","placeholder":"例：趣味が合う人と自然に仲良くなりたい"},
  {"label":"理想のパートナーのタイプは？","placeholder":"例：話していて飽きない人"},
  {"label":"休日の過ごし方は？","placeholder":"例：カフェ巡りとサウナ"},
  {"label":"好きな食べ物は？","placeholder":"例：ラーメンとスイーツ"},
  {"label":"自分のここをアピールしたい！","placeholder":"例：話しやすいと言われます"},
  {"label":"相手に一言","placeholder":"例：まずはゆっくりお話しましょう"}
]'),

('勉強会・エンジニア', array['ライフスタイル・エンタメ','日常・交流'], '[
  {"label":"エンジニア歴は？","placeholder":"例：5年目、フロントエンド専門"},
  {"label":"主な技術スタックは？","placeholder":"例：TypeScript / React / Next.js"},
  {"label":"得意な領域は？","placeholder":"例：フロントエンド、バックエンド、インフラ"},
  {"label":"最近触ってる技術・ツールは？","placeholder":"例：Bun、Hono、LLM API"},
  {"label":"副業・個人開発はやってる？","placeholder":"例：個人でSaaSを作ってる"},
  {"label":"勉強会参加の目的は？","placeholder":"例：情報収集と横のつながり"},
  {"label":"SNS・GitHubは公開してる？","placeholder":"例：@xxxx で活動してます"}
]'),

('ビジネス交流', array['ライフスタイル・エンタメ','日常・交流'], '[
  {"label":"どんな仕事をしてる？","placeholder":"例：Webマーケター、スタートアップのPM"},
  {"label":"今取り組んでいるテーマ・事業は？","placeholder":"例：AIを活用したコンテンツ制作"},
  {"label":"交流会に来た目的は？","placeholder":"例：共同事業のパートナーを探してる"},
  {"label":"得意なことは？","placeholder":"例：マーケティング、グロースハック"},
  {"label":"SNS・WebサイトはURLを教えて","placeholder":"例：LinkedIn / X / Webサイト"},
  {"label":"一緒にやってみたいことは？","placeholder":"例：新規事業の壁打ち歓迎"}
]'),

('旅行好き', array['ライフスタイル・エンタメ','日常・交流'], '[
  {"label":"年何回旅行に行く？","placeholder":"例：年5〜6回、うち海外1〜2回"},
  {"label":"好きな旅行スタイルは？","placeholder":"例：ひとり旅でぶらぶら"},
  {"label":"今まで行った中で一番よかった国・場所は？","placeholder":"例：台湾、屋久島"},
  {"label":"次に行きたい場所は？","placeholder":"例：まだ計画中"},
  {"label":"旅行の魅力を一言","placeholder":"例：非日常で自分がリセットできる"}
]'),

('同人・創作交流', array['ライフスタイル・エンタメ','日常・交流'], '[
  {"label":"創作歴は？","placeholder":"例：高校から小説を書いてる"},
  {"label":"活動ジャンル・カップリングは？","placeholder":"例：まだ内緒"},
  {"label":"オンライン or オフライン活動？","placeholder":"例：Pixiv・TwitterとコミケはWeb参加"},
  {"label":"コミケ・同人誌即売会には行ってる？","placeholder":"例：夏冬欠かさず参加"},
  {"label":"創作の魅力を一言","placeholder":"例：好きなものへの愛を形にできる"}
]'),

('鉄道好き', array['ライフスタイル・エンタメ','日常・交流'], '[
  {"label":"鉄道好き歴は？","placeholder":"例：幼少期から電車に乗るのが好きで"},
  {"label":"鉄道の何が好き？","placeholder":"例：乗り鉄、撮り鉄、廃線探索"},
  {"label":"好きな路線・車両は？","placeholder":"例：山陰本線、E7系かがやき"},
  {"label":"全国の路線完乗を目指してる？","placeholder":"例：JR全線完乗まであと少し"},
  {"label":"鉄道の魅力を一言","placeholder":"例：乗るだけで旅ができる"}
]'),

('犬派・猫派', array['ライフスタイル・エンタメ','日常・交流'], '[
  {"label":"犬派？猫派？","placeholder":"例：猫派、でも犬も好き"},
  {"label":"ペットは飼ってる？","placeholder":"例：猫を2匹飼ってる"},
  {"label":"ペットの名前・品種は？","placeholder":"例：ムギとコムギ、スコティッシュフォールド"},
  {"label":"ペットの魅力を一言","placeholder":"例：無条件に癒してくれる存在"},
  {"label":"動物に関して一番好きな話・エピソードは？","placeholder":"例：うちの猫が毎朝起こしに来る"}
]'),

('ガジェット・自作PC', array['ライフスタイル・エンタメ','日常・交流'], '[
  {"label":"ガジェット好き歴は？","placeholder":"例：高校生の頃からPCパーツを買い集めてる"},
  {"label":"メインPCのスペックは？","placeholder":"例：RTX 4090、Ryzen 9"},
  {"label":"好きなガジェットは？","placeholder":"例：メカニカルキーボード、トラックボール"},
  {"label":"最近買ったよかったものは？","placeholder":"例：まだ内緒"},
  {"label":"ガジェットの魅力を一言","placeholder":"例：作業効率と所有欲が同時に満たされる"}
]'),

('インテリア・観葉植物', array['ライフスタイル・エンタメ','日常・交流'], '[
  {"label":"インテリアにこだわり始めたのは？","placeholder":"例：一人暮らしを始めてから"},
  {"label":"好きなインテリアスタイルは？","placeholder":"例：北欧ナチュラル、インダストリアル"},
  {"label":"観葉植物は育ててる？","placeholder":"例：モンステラとポトスを育ててる"},
  {"label":"こだわりのアイテムは？","placeholder":"例：IKEAとアクタスでミックスしてる"},
  {"label":"インテリアの魅力を一言","placeholder":"例：空間を整えると心も整う"}
]'),

('MBTI（16タイプ診断）', array['ライフスタイル・エンタメ','日常・交流'], '[
  {"label":"あなたのMBTIタイプは？","placeholder":"例：INFP、ENFJ"},
  {"label":"診断結果に納得してる？","placeholder":"例：80%くらいは当たってると思う"},
  {"label":"一番共感した部分は？","placeholder":"例：「一人の時間が必要」というところ"},
  {"label":"好きなタイプ・相性がいいタイプは？","placeholder":"例：INTPと話すと楽しい"},
  {"label":"MBTIについてひとこと","placeholder":"例：自己理解のきっかけになった"}
]'),

-- 映画（漏れていたので追加）
('MCU・映画好き', array['アニメ・ゲーム','映画'], '[
  {"label":"映画歴は？","placeholder":"例：年50本以上見てる"},
  {"label":"好きなシリーズ・ジャンルは？","placeholder":"例：MCU、SF、ホラー"},
  {"label":"今まで見た中で一番好きな映画は？","placeholder":"例：「インターステラー」「アベンジャーズ/エンドゲーム」"},
  {"label":"映画館派 or 配信派？","placeholder":"例：大作は映画館、それ以外はNetflix"},
  {"label":"MCUは全作品追ってる？","placeholder":"例：Phase 1から全部見てる"},
  {"label":"最近見てよかった映画は？","placeholder":"例：まだ内緒（ネタバレになるので）"},
  {"label":"映画の魅力を一言","placeholder":"例：2時間で別の世界を体験できる"}
]');

-- ============================================================
-- [0] 汎用セット（グループ別）
-- ============================================================

insert into memoria.template_nodes (name, path, questions) values

('基本', array['汎用'], '[
  {"label":"名前","placeholder":"例：山田太郎"},
  {"label":"ニックネーム","placeholder":"例：たろちゃん"},
  {"label":"呼ばれたい名前","placeholder":"例：好きに呼んで！"},
  {"label":"年齢","placeholder":"例：25歳"},
  {"label":"誕生日","placeholder":"例：3月14日"},
  {"label":"出身地","placeholder":"例：大阪府"},
  {"label":"今住んでいる場所","placeholder":"例：東京・渋谷"},
  {"label":"血液型","placeholder":"例：O型"},
  {"label":"星座","placeholder":"例：うお座"},
  {"label":"一言自己紹介","placeholder":"例：よろしくお願いします！"}
]'),

('生活', array['汎用'], '[
  {"label":"朝型 or 夜型？","placeholder":"例：完全に夜型"},
  {"label":"睡眠時間は？","placeholder":"例：6時間くらい"},
  {"label":"休日の過ごし方","placeholder":"例：昼まで寝てカフェに行く"},
  {"label":"落ち着く場所","placeholder":"例：お風呂の中"},
  {"label":"ついやってしまうこと","placeholder":"例：スマホをずっと見てしまう"},
  {"label":"最近買ってよかったもの","placeholder":"例：電動歯ブラシ"},
  {"label":"ストレス発散方法","placeholder":"例：一人でドライブ"},
  {"label":"部屋の雰囲気","placeholder":"例：北欧ナチュラル、ものが多い"},
  {"label":"一人の時間と人といる時間、どっちが好き？","placeholder":"例：6:4で一人の時間が好き"},
  {"label":"最近の小さな幸せ","placeholder":"例：コンビニで好きなデザートが残ってた"}
]'),

('仕事・学び', array['汎用'], '[
  {"label":"職種・仕事内容","placeholder":"例：Webエンジニア、営業、学生"},
  {"label":"働き方","placeholder":"例：フルリモート、週3出社"},
  {"label":"仕事でやりがいを感じる瞬間","placeholder":"例：ユーザーに喜ばれた時"},
  {"label":"今学んでいること","placeholder":"例：Python、英語"},
  {"label":"仕事のモットー","placeholder":"例：まず動く、あとで考える"},
  {"label":"尊敬している人（仕事面）","placeholder":"例：スティーブ・ジョブズ"},
  {"label":"資格・得意なスキルは？","placeholder":"例：FP2級、Photoshop"},
  {"label":"副業・個人開発はやってる？","placeholder":"例：週末に個人アプリを作ってる"},
  {"label":"5年後どうなっていたい？","placeholder":"例：独立してる"}
]'),

('趣味・エンタメ', array['汎用'], '[
  {"label":"最近ハマってること","placeholder":"例：サウナ、ボードゲーム"},
  {"label":"昔ハマってたこと","placeholder":"例：バスケ、ニコ動"},
  {"label":"推し","placeholder":"例：秘密！"},
  {"label":"好きな音楽ジャンル","placeholder":"例：J-POP、シティポップ"},
  {"label":"好きな映画・ドラマのジャンル","placeholder":"例：SF、コメディ"},
  {"label":"本はよく読む？","placeholder":"例：月2〜3冊、漫画ならたくさん"},
  {"label":"コレクションしているもの","placeholder":"例：フィギュア、レコード、スニーカー"},
  {"label":"最近行ったライブ・イベント","placeholder":"例：まだ内緒"},
  {"label":"カラオケの十八番は？","placeholder":"例：米津玄師の「Lemon」"},
  {"label":"旅行先で一番よかった場所","placeholder":"例：屋久島、台湾"}
]'),

('食・好み', array['汎用'], '[
  {"label":"好きな食べ物","placeholder":"例：ラーメン、チョコ、唐揚げ"},
  {"label":"苦手な食べ物","placeholder":"例：パクチー、レバー"},
  {"label":"好きな飲み物","placeholder":"例：コーヒー（ブラック）、ほうじ茶"},
  {"label":"甘党 or 辛党？","placeholder":"例：どっちも好き、強いて言えば甘党"},
  {"label":"外食で好きなジャンルは？","placeholder":"例：ラーメン屋、焼き鳥、カフェ"},
  {"label":"自炊する？","placeholder":"例：週3くらいはする"},
  {"label":"お酒は飲む？","placeholder":"例：ビールと日本酒が好き、週2くらい"},
  {"label":"食べ放題で行きたいお店","placeholder":"例：焼肉、寿司"},
  {"label":"コンビニで必ず買うもの","placeholder":"例：ファミマのメロンパン"}
]'),

('人間関係', array['汎用'], '[
  {"label":"家族構成","placeholder":"例：一人暮らし、実家暮らし・3人家族"},
  {"label":"兄弟姉妹の中での順番","placeholder":"例：長男、末っ子、一人っ子"},
  {"label":"友達との過ごし方","placeholder":"例：ご飯食べてだらだらする"},
  {"label":"新しい人と仲良くなるのは得意？","placeholder":"例：最初は人見知りだけどすぐ慣れる"},
  {"label":"コミュニケーションスタイル","placeholder":"例：聞き役が多い"},
  {"label":"友達に一言で言うとどんな人？","placeholder":"例：いつもふざけてるらしい"},
  {"label":"怒るとどうなる？","placeholder":"例：黙り込む、すぐ忘れる"},
  {"label":"恋愛観（ざっくりと）","placeholder":"例：ゆっくり仲良くなってから"},
  {"label":"人間関係で大切にしていること","placeholder":"例：約束は守る"},
  {"label":"最近感謝したこと","placeholder":"例：友達が話を聞いてくれた"}
]'),

('ネット・デジタル', array['汎用'], '[
  {"label":"よく使うSNSは？","placeholder":"例：X（Twitter）、Instagram"},
  {"label":"SNSのアカウントを教えて","placeholder":"例：@xxxx"},
  {"label":"スマホのOSは？","placeholder":"例：iPhone、Android"},
  {"label":"よく使うアプリは？","placeholder":"例：Spotify、YouTube、TikTok"},
  {"label":"ゲームはやる？","placeholder":"例：スマホゲーとSwitchが主"},
  {"label":"YouTubeでよく見るジャンル","placeholder":"例：ゲーム実況、料理、Vlog"},
  {"label":"PCは持ってる？","placeholder":"例：MacBook Pro使ってる"},
  {"label":"ネット上のあだ名・ハンドルネーム","placeholder":"例：@xxxx で活動してます"},
  {"label":"テクノロジーへの興味は？","placeholder":"例：AI・ガジェット好き"},
  {"label":"おすすめのアプリ・サービス","placeholder":"例：Notionは人生変わった"}
]'),

('価値観・内面', array['汎用'], '[
  {"label":"尊敬する人","placeholder":"例：エジソン、祖父"},
  {"label":"座右の銘・好きな言葉","placeholder":"例：「案ずるより産むが易し」"},
  {"label":"自分の長所","placeholder":"例：行動力がある"},
  {"label":"自分の短所","placeholder":"例：飽き性"},
  {"label":"幸せを感じる瞬間","placeholder":"例：好きなものを食べてる時"},
  {"label":"人生で大切にしていること","placeholder":"例：健康と家族"},
  {"label":"今一番の悩み（話せる範囲で）","placeholder":"例：お金と時間が足りない"},
  {"label":"10年後どうなっていたい？","placeholder":"例：好きなことで生きてる"},
  {"label":"最近変わったこと・成長したこと","placeholder":"例：早起きができるようになった"},
  {"label":"もし世界を変えられるなら何をする？","placeholder":"例：全人類に昼寝タイムを作る"}
]'),

('もしも系', array['汎用'], '[
  {"label":"自分を動物に例えると","placeholder":"例：猫（自由に生きてる）"},
  {"label":"無人島に一つ持っていくなら","placeholder":"例：スマホ（電波はある前提）"},
  {"label":"宝くじ1億円当たったら","placeholder":"例：全部投資、家を買う、世界一周"},
  {"label":"タイムマシンがあったら","placeholder":"例：10年前の自分に会いに行く"},
  {"label":"超能力が使えるなら","placeholder":"例：瞬間移動、時間停止"},
  {"label":"前世は何だったと思う？","placeholder":"例：猫、旅人"},
  {"label":"生まれ変わるなら何になりたい？","placeholder":"例：もう一度人間、猫"},
  {"label":"魔法が使えるなら","placeholder":"例：時間を増やす魔法"},
  {"label":"ドラえもんの道具を一つもらえるなら","placeholder":"例：どこでもドア一択"},
  {"label":"今日が最後の日だったら何をする？","placeholder":"例：好きな人と好きなものを食べる"}
]'),

('フリー', array['汎用'], '[
  {"label":"自由記入欄","placeholder":"例：なんでも書いていいよ！"},
  {"label":"今の一言","placeholder":"例：よろしく！"},
  {"label":"最近の出来事","placeholder":"例：ちょっといいことがあった"},
  {"label":"伝えたいこと","placeholder":"例：連絡待ってます"},
  {"label":"ひみつ","placeholder":"例：内緒！"},
  {"label":"今日のひとこと日記","placeholder":"例：今日もよく生きた"}
]');
