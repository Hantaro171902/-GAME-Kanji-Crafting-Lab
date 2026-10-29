import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';

import 'app.dart';
import 'core/storage/progress_store.dart';
import 'data/repositories/progress_repository.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Hive.initFlutter();
  final store = ProgressStore();
  await store.init();
  final repository = ProgressRepository(store);
  runApp(MindForgeApp(repository: repository));
}