import 'package:flutter/material.dart';
import 'package:nyanbuzz/config/logger.dart';
import 'package:nyanbuzz/presentation/home_page.dart';

void main() {
  // flavor の取得
  const flavor = String.fromEnvironment('FLAVOR');
  logger.i('FLAVOR : $flavor');
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const HomePage(),
    );
  }
}
